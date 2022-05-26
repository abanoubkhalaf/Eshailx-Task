import React, { useEffect, useState } from "react";
import moment from "moment";
import { getNASAPictures } from "./NasaAPI";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import Grid from "./Components/Grid";
import classes from "./app.module.css";

function App() {
  const [pictures, updatePictures] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState([]);
  const [filteredValue, setFilteredValue] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);

  let skip = 0;
  let limit = 6;

  const filterDates = [
    { value: 7, label: "week" },
    {
      value: 14,
      label: "Two Weeks",
    },
    {
      value: 30,
      label: "month",
    },
  ];

  useEffect(() => {
    if (!pictures) {
      const startDate = new Date("2022-01-01T08:28:41.917Z");
      const endDate = new Date();
      getNASAPictures(startDate, endDate).then((res) => {
        let handlingRes = res.filter((data) => data.media_type === "image");
        setPageCount(Math.floor(handlingRes.length / limit));
        updatePictures(handlingRes);
      });
    }
  }, [limit, pictures]);

  let today = moment().format("YYYY-MM-DD");

  const getSelectValue = (e) => {
    setFilteredValue(e.value);
    let filteredDate = moment().subtract(e.value, "days").format("YYYY-MM-DD");
    let filteredItems = pictures?.filter(
      (pic) => pic.date >= filteredDate && pic.date < today
    );
    setFilteredItems(filteredItems);
    setPageCount(Math.floor(filteredItems.length / limit));
    if (filteredItems.length !== 0) {
      let check = filteredItems.slice(skip, skip + limit);
      setItemsPerPage(check);
    } else {
      let itemsInPage = pictures?.slice(skip, skip + limit);
      setItemsPerPage(itemsInPage);
    }
  };

  const handlePageClick = (e) => {
    skip = e.selected * limit;
    if (filteredItems.length !== 0) {
      let check = filteredItems.slice(skip, skip + limit);
      setItemsPerPage(check);
    } else {
      let itemsInPage = pictures?.slice(skip, skip + limit);
      setItemsPerPage(itemsInPage);
    }
  };

  return (
    <div>
      {
        <div className={classes.select}>
          <Select
            defaultValue={filteredValue}
            options={filterDates}
            onChange={getSelectValue}
          />
        </div>
      }

      {filteredItems.length !== 0 ? (
        <Grid items={itemsPerPage?.slice(skip, limit)} />
      ) : itemsPerPage.length !== 0 ? (
        <Grid items={itemsPerPage?.slice(skip, limit)} />
      ) : (
        <Grid items={pictures?.slice(skip, limit)} />
      )}

      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default App;
