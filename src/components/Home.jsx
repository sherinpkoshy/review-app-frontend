import React from "react";
import Container from "./Container";
import NotVerified from "./user/NotVerified";
import SlideShow from "./user/SlideShow";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedTVSeries from "./user/TopRatedTVSeries";
import TopRatedWebSeries from "./user/TopRatedWebSeries";

export default function Home() {
  return (
    <div className="dark:bg-primary bg-white min-h-screen">
      <Container>
        <NotVerified />
        {/* slider */}
        <SlideShow />
        {/* Most rated movies */}
        <div className="space-y-3 py-8">
          <TopRatedMovies />
          <TopRatedWebSeries />
          <TopRatedTVSeries />
        </div>
      </Container>
    </div>
  );
}
