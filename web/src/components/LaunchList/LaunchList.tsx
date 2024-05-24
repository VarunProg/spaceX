import React, { useEffect, useState, useCallback } from "react";
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
import { FilterState, Launch } from "../../types/LaunchList";


const LaunchList: React.FC = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [prevLaunches, setPrevLaunches] = useState<Launch[]>([]);
  const [extendedIdx, setExtendedIdx] = useState(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    launchStatus: "all",
    sort: "asc",
    limit: 5,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLaunchesByStatus = async (filter: FilterState, page: number) => {
    if (filter.launchStatus === "upcoming") {
      return await fetchUpcomingLaunches(filter.limit, page);
    } else if (filter.launchStatus === "previous") {
      return await fetchPreviousLaunches(filter.limit, page);
    }
    return await fetchLaunches(filter.limit, page);
  };

  const getLaunches = useCallback(async (filter: FilterState, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLaunchesByStatus(filter, page);
      const sortedLaunches = data.sort((a: { launch_date_utc: string | number | Date; }, b: { launch_date_utc: string | number | Date; }) => {
        const dateA = new Date(a.launch_date_utc).getTime();
        const dateB = new Date(b.launch_date_utc).getTime();
        return filter.sort === "asc" ? dateA - dateB : dateB - dateA;
      });
      setLaunches((previousLaunches) =>
        page === 1 ? sortedLaunches : [...previousLaunches, ...sortedLaunches]
      );
      setPrevLaunches(sortedLaunches);
      setHasMore(data.length > 0);
    } catch (error) {
      setError("Failed to fetch SpaceX data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    !isSearchActive && getLaunches(filter, page);
  }, [filter, isSearchActive, page, getLaunches]);

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
      setPage(1);
      setLoading(true);
    }
  };

  const getFlickerImage = (launch: Launch): JSX.Element => {
    return launch.links && launch.links.flickr_images.length > 0 ? (
      <img src={launch.links.flickr_images[0]} alt="Flicker" />
    ) : (
      <RocketTakeoff size={50} />
    );
  };
  
  const searchObjectsForTerm = (arr: Launch[], term: string) => {
    const searchResults: any[] = [];

    const search = (
      parent: null | { [x: string]: string },
      obj: { [x: string]: string },
      term: string
    ) => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          const childObj = obj[key] as unknown as { [x: string]: string };
          if (parent === null) parent = obj;
          search(parent, childObj, term);
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

    arr.forEach((obj: Launch) => {
      search(null, obj, term);
    });

    return searchResults;
  };

  const handleSearch = (e: { target: { value: any } }) => {
    const searchTerm = e.target.value;
    let searchResults;
    if (searchTerm !== "") {
      setIsSearchActive(true);
      searchResults = searchObjectsForTerm(prevLaunches, searchTerm);
      console.log("searchResults",searchResults)
      console.log("searchTerm",searchTerm)
      setLaunches(searchResults);
    } else {
      setIsSearchActive(false);
      setPage(1);
    }
  };

  const debounce = (fn: Function, delay = 1000): Function => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      clearTimeout(timerId as ReturnType<typeof setTimeout>);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      hasMore &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  debounce(handleSearch, 500)(e)
                }
              />
            </InputGroup>
          </div>
        </div>
        {loading && launches.length === 0 ? (
          <div className={classes.loader}>
            <Spinner animation="border" variant="dark" />
          </div>
        ) : error ? (
          <div className={classes.error}>{error}</div>
        ) : launches.length === 0 ? (
          <div className={classes.noDataFound}>{"No Data Found"}</div>
        ) : (
          launches.map((launch, itemIdx) => (
            <div className={classes.launchItem} key={launch.id}>
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
                        <p>{launch.details}</p>
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
                  {extendedIdx === itemIdx ? (
                    <CaretUpFill onClick={() => setExtendedIdx(-1)} />
                  ) : (
                    <CaretDownFill onClick={() => setExtendedIdx(itemIdx)} />
                  )}{" "}
                  {"more"}
                </p>
                <div
                  className={
                    extendedIdx === itemIdx && launch.details
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
        {loading && launches.length > 0 && (
          <div className={classes.loader}>
            <Spinner animation="border" variant="dark" />
          </div>
        )}
      </div>
    </>
  );
};

export default LaunchList;
