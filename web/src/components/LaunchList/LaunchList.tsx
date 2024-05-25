import React, { useCallback, useEffect, useState } from "react";
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
  Search,
} from "react-bootstrap-icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { FilterState, Launch } from "../../types/LaunchList";

const LaunchList: React.FC = () => {
  const [prevLaunches, setPrevLaunches] = useState<Launch[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    launchStatus: "all",
    sort: "asc",
    limit: 10,
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
      const sortedLaunches = data.sort(
        (
          a: { launch_date_utc: string | number | Date },
          b: { launch_date_utc: string | number | Date }
        ) => {
          const dateA = new Date(a.launch_date_utc).getTime();
          const dateB = new Date(b.launch_date_utc).getTime();
          return filter.sort === "asc" ? dateA - dateB : dateB - dateA;
        }
      );
      setPrevLaunches((previousLaunches) =>
        page === 1 ? sortedLaunches : [...previousLaunches, ...sortedLaunches]
      );
      setLaunches((previousLaunches) =>
        page === 1 ? sortedLaunches : [...previousLaunches, ...sortedLaunches]
      );
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
        document.documentElement.offsetHeight - 200 &&
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
      <Container className={classes.container}>
        <Row className={classes.filters}>
          <Col md={6} className={classes.selectFilters}>
            <Row>
              <Col className={classes.selectLabel}>
                <h4 className={classes.heading}>{"Launch Status"}</h4>
              </Col>
              <Col className={classes.selectDropdown}>
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
              </Col>

              <Col className={classes.selectLabel}>
                <h4 className={classes.heading}>{"SortBy Date"}</h4>
              </Col>
              <Col className={classes.selectDropdown}>
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
                    <Dropdown.Item
                      eventKey="asc"
                      active={filter.sort === "asc"}
                    >
                      Asc
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="desc"
                      active={filter.sort === "desc"}
                    >
                      Desc
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Col>

          <Col md={4} className={classes.searchFilters}>
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
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {loading && launches.length === 0 ? (
              <Row className={classes.loader}>
                <Spinner animation="border" variant="dark" />
              </Row>
            ) : error ? (
              <Row className={classes.error}>{error}</Row>
            ) : launches.length === 0 ? (
              <Row className={classes.noDataFound}>{"No Data Found"}</Row>
            ) : (
              <Row className="justify-content-center">
                {launches.map((launch: any) => (
                  <Card className={classes.launchCardItem}>
                    {launch.links && launch.links.flickr_images.length > 0 ? (
                      <Card.Img
                        className={classes.launchImage}
                        variant="top"
                        src={launch.links.flickr_images[0]}
                      />
                    ) : (
                      <Card.Img
                        className={classes.launchImage}
                        variant="top"
                        as={RocketTakeoff}
                      />
                    )}
                    <Card.Body className={classes.rocketInfo}>
                      <Card.Title>
                        <Badge
                          bg={launch.upcoming ? "success" : "dark"}
                          className={classes.launchType}
                        >
                          {launch.upcoming ? "Upcoming" : "Previous"}
                        </Badge>
                      </Card.Title>
                      {launch.rocket?.rocket_name && (
                        <Card.Text>
                          <Card.Title className={classes.heading}>
                            {"Name"}
                          </Card.Title>
                          <Card.Text>{launch.rocket.rocket_name}</Card.Text>
                        </Card.Text>
                      )}
                      {launch.mission_name && (
                        <Card.Text>
                          <Card.Title className={classes.heading}>
                            {"Mission"}
                          </Card.Title>
                          <Card.Text>{launch.mission_name}</Card.Text>
                        </Card.Text>
                      )}
                      {launch.launch_year && (
                        <Card.Text>
                          <Card.Title className={classes.heading}>
                            {"Launch Year"}
                          </Card.Title>
                          <Card.Text>{launch.launch_year}</Card.Text>
                        </Card.Text>
                      )}
                      {launch.launch_success && (
                        <Card.Text>
                          <Card.Title className={classes.heading}>
                            {"Launch Year"}
                          </Card.Title>
                          <Card.Text>{launch.launch_success}</Card.Text>
                        </Card.Text>
                      )}
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      <Card.Body className={classes.links}>
                        <Button>
                          <Card.Link
                            href={launch.links?.wikipedia}
                            target="_blank"
                          >
                            <Wikipedia />
                          </Card.Link>
                        </Button>
                        <Button>
                          <Card.Link
                            href={launch.links?.video_link}
                            target="_blank"
                          >
                            <PlayBtnFill />
                          </Card.Link>
                        </Button>
                        <Button>
                          <Card.Link
                            href={launch.links?.reddit_media}
                            target="_blank"
                          >
                            <Link45deg />
                          </Card.Link>
                        </Button>
                      </Card.Body>
                    </ListGroup>
                  </Card>
                ))}
              </Row>
            )}
            {loading && launches.length > 0 && (
              <Row className={classes.loader}>
                <Spinner animation="border" variant="dark" />
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LaunchList;
