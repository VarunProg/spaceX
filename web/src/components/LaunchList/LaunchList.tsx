import React, { useEffect, useState } from "react";
import {
  fetchLaunches,
  fetchUpcomingLaunches,
  fetchPreviousLaunches,
} from "../../services/spacexService";
import classes from "./LaunchList.module.scss";
import {
  RocketTakeoff,
  Wikipedia,
  PlayBtnFill,
  Link45deg,
  CaretDownFill,
  CaretUpFill,
  Search,
} from "react-bootstrap-icons";
import {
  Badge,
  Button,
  Dropdown,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";

interface Rocket {
  rocket_name: string;
  rocket_type: string;
  description: string;
  country: string;
  type: string;
  name: string;
}

interface Launch {
  launch_date_local: string;
  launch_date_utc: string;
  id: string;
  details: string;
  rocket: {
    rocket_name: string;
    rocket_type: string;
    rocket: Rocket;
  };
  upcoming: boolean;
  launch_success: boolean | null;
  links: {
    flickr_images: string[];
  };
}
interface FilterState {
  launchStatus: String;
  sort: string;
  limit: number;
}

const LaunchList: React.FC = () => {
  const [prevLaunches, setPrevLaunches] = useState<Launch[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [extendedIdx, setExtendedIdx] = useState(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    launchStatus: "all",
    sort: "asc",
    limit: 20,
  });

  const fetchLaunchesByStatus = async (filter: FilterState) => {
    if (filter.launchStatus === "upcoming") {
      return await fetchUpcomingLaunches(filter.limit);
    } else if (filter.launchStatus === "previous") {
      return await fetchPreviousLaunches(filter.limit);
    }
    return await fetchLaunches(filter.limit);
  };

  const getLaunches = async (filter: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLaunchesByStatus(filter);
      console.log("data", data);
      const sortedLaunches = data.sort(
        (
          a: { launch_date_utc: string | number | Date },
          b: { launch_date_utc: string | number | Date }
        ) => {
          const dateA = new Date(a.launch_date_utc).getTime();
          const dateB = new Date(b.launch_date_utc).getTime();
          if (filter.sort === "asc") {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        }
      );
      setPrevLaunches(sortedLaunches);
      setLaunches(sortedLaunches);
    } catch (error) {
      setError("Failed to fetch SpaceX data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    !isSearchActive && getLaunches(filter);
  }, [filter, isSearchActive]);

  const handleFilterChange = (eventKey: string | null, filterType: string) => {
    if (eventKey !== null) {
      let modifiedFilter = filter;
      if (filterType === "launchStatus") {
        modifiedFilter.launchStatus = eventKey;
      } else if (filterType === "sort") {
        modifiedFilter.sort = eventKey;
      }

      setFilter((prevFilter) => ({
        ...prevFilter,
        ...modifiedFilter,
      }));
    }
  };

  const getFlickerImage = (launch: {
    links: { flickr_images: string | any[] };
  }) => {
    return launch.links && launch.links.flickr_images.length > 0 ? (
      <img src={launch.links.flickr_images[0]} />
    ) : (
      <RocketTakeoff size={50} />
    );
  };

  const searchObjectsForTerm = (arr, term) => {
    const searchResults = [];

    const search = (parent, obj, term) => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (parent === null) parent = obj;
          search(parent, obj[key], term);
        } else if (
          typeof obj[key] === "string" &&
          obj[key].toLowerCase().includes(term.toLowerCase())
        ) {
          if (parent !== null) {
            searchResults.push(parent);
            parent = null;
          } else {
            searchResults.push(obj);
          }
          break;
        }
      }
    };

    arr.forEach((obj) => {
      search(null, obj, term);
    });

    return searchResults;
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    let searchResults;
    if (searchTerm != "") {
      setIsSearchActive(true);
      searchResults = searchObjectsForTerm(prevLaunches, searchTerm);
      setLaunches(searchResults);
    } else {
      setIsSearchActive(false);
    }
  };

  const debounce = (fn, delay = 1000) => {
    let timerId = null;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.filters}>
          <div className={classes.selectFilters}>
            <h4 className={classes.heading}>{"Launch Status"}</h4>
            <Dropdown
              data-bs-theme="dark"
              onSelect={(e) => handleFilterChange(e, "launchStatus")}
            >
              <Dropdown.Toggle
                id="dropdown-button-dark-example1"
                variant="secondary"
                className={classes.selectFilterText}
              >
                {filter.launchStatus}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  eventKey="all"
                  active={filter.launchStatus === "all"}
                >
                  All
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="upcoming"
                  active={filter.launchStatus === "upcoming"}
                >
                  Upcoming
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="previous"
                  active={filter.launchStatus === "previous"}
                >
                  Previous
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <h4 className={classes.heading}>{"SortBy Date"}</h4>
            <Dropdown
              onSelect={(e) => handleFilterChange(e, "sort")}
              data-bs-theme="dark"
            >
              <Dropdown.Toggle
                id="dropdown-button-dark-example1"
                variant="secondary"
                className={classes.selectFilterText}
              >
                {filter.sort}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="asc" active={filter.sort === "asc"}>
                  Asc
                </Dropdown.Item>
                <Dropdown.Item eventKey="desc" active={filter.sort === "desc"}>
                  Desc
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className={classes.searchFilters}>
            <InputGroup>
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search here.."
                onChange={debounce(handleSearch, 500)}
              />
            </InputGroup>
          </div>
        </div>
        {loading ? (
          <div className={classes.loader}>
            <Spinner animation="border" variant="dark" />
          </div>
        ) : error ? (
          <div className={classes.error}>{error}</div>
        ) : launches.length === 0 ? (
          <div className={classes.noDataFound}>{"No Data Found"}</div>
        ) : (
          launches.map((launch: any, itemIdx: number) => (
            <div className={classes.launchItem}>
              <div className={classes.launchItemRow}>
                <div className={classes.launchImage}>
                  {getFlickerImage(launch)}
                </div>
                <div className={classes.launchDetails}>
                  <Badge
                    bg={launch.upcoming ? "success" : "dark"}
                    className={classes.launchType}
                  >
                    {launch.upcoming ? "Upcoming" : "Previous"}
                  </Badge>
                  <div className={classes.subDetails}>
                    {launch.rocket?.rocket_name && (
                      <div>
                        <h6 className={classes.heading}>{"Name"}</h6>
                        <p>{launch.rocket.rocket_name}</p>
                      </div>
                    )}
                    {launch.mission_name && (
                      <div>
                        <h6 className={classes.heading}>{"Mission"}</h6>
                        <p>{launch.mission_name}</p>
                      </div>
                    )}
                    {launch.launch_year && (
                      <div>
                        <h6 className={classes.heading}>{"Launch Year"}</h6>
                        <p>{launch.launch_year}</p>
                      </div>
                    )}
                    {launch.launch_success && (
                      <div>
                        <h6 className={classes.heading}>{"Status"}</h6>
                        <p>{launch.deatils}</p>
                      </div>
                    )}
                  </div>
                  <div className={classes.linksDetails}>
                    {launch.links && (
                      <div>
                        <h6 className={classes.heading}>{"Links"}</h6>
                        <div className={classes.links}>
                          <Button>
                            <a href={launch.links?.wikipedia} target="_blank">
                              <Wikipedia />
                            </a>
                          </Button>
                          <Button>
                            <a href={launch.links?.video_link} target="_blank">
                              <PlayBtnFill />
                            </a>
                          </Button>
                          <Button>
                            <a
                              href={launch.links?.reddit_media}
                              target="_blank"
                            >
                              <Link45deg />
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={classes.launchBottomRow}>
                <p>
                  {extendedIdx == itemIdx ? (
                    <CaretUpFill onClick={() => setExtendedIdx(-1)} />
                  ) : (
                    <CaretDownFill onClick={() => setExtendedIdx(itemIdx)} />
                  )}{" "}
                  {"more"}
                </p>
                <div
                  className={
                    extendedIdx == itemIdx && launch.details
                      ? classes.detailsVisible
                      : classes.detailsHidden
                  }
                >
                  <h6 className={classes.heading}>{"Details"}</h6>
                  <p>{launch.details}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default LaunchList;
