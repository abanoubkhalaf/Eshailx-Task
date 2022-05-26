import React from "react";
import classes from "./grid.module.css";

export default function Grid({ items }) {
  return (
    <div className={classes.container}>
      <main>
        <section className={classes.grid}>
          {items?.map((item) => (
            <div key={item.date} className={classes.parent}>
              <div
                className={classes.upperPart}
                style={{
                  backgroundImage: `url(${item.url})`,
                }}
              ></div>
              <p>{item.date}</p>

              <div className={classes.downPart}>
                <h5>{item.title}</h5>
                <p>{item.copyright}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
