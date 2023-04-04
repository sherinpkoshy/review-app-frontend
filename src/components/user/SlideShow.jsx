import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";

let count = 0;
let intervalId;
export default function SlideShow() {
  const [slide, setSlide] = useState({});
  const [clonedSlide, setClonedSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [upNext, setUpNext] = useState([]);
  const [visible, setVisible] = useState(true);
  const slideRef = useRef();
  const clonedSlideRef = useRef();

  const { updateNotification } = useNotification();

  const fetchLatestUploads = async (signal) => {
    const { error, movies } = await getLatestUploads(signal);
    if (error) return updateNotification("error", error);
    setSlides([...movies]);
    setSlide(movies[0]);
  };

  const startSlideshow = () => {
    intervalId = setInterval(handleOnNextClick, 3500);
  };

  const stopSlideshow = () => {
    clearInterval(intervalId);
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;
    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    let newSlides = [...slides];
    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }
    setUpNext([...newSlides]);
  };

  const handleOnNextClick = () => {
    stopSlideshow();
    setClonedSlide(slides[count]);
    count = (count + 1) % slides.length;
    setSlide(slides[count]);

    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
    startSlideshow();
    updateUpNext(count);
  };
  const handleOnPreviousClick = () => {
    stopSlideshow();
    setClonedSlide(slides[count]);
    count = (count + slides.length - 1) % slides.length;
    setSlide(slides[count]);
    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
    startSlideshow();
    updateUpNext(count);
  };

  const handleOnAnimationEnd = () => {
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    clonedSlideRef.current.classList.remove(...classes);
    slideRef.current.classList.remove(...classes);
    setClonedSlide({});
  };

  const handleOnVisibilityChange = () => {
    const visibility = document.visibilityState;
    if (visibility === "hidden") setVisible(false);
    if (visibility === "visible") setVisible(true);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchLatestUploads(ac.signal);

    document.addEventListener("visibilitychange", handleOnVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleOnVisibilityChange
      );
      ac.abort();
    };
  }, []);

  useEffect(() => {
    if (slides.length && visible) {
      startSlideshow();
      updateUpNext(count);
    } else stopSlideshow();
    return () => {
      stopSlideshow();
    };
  }, [slides.length, visible]);

  return (
    <div className="flex w-full">
      {/* Slide show section */}
      <div className="md:w-4/5 w-full aspect-video relative overflow-hidden">
        <div className="w-full cursor-pointer">
          <Link to={"/movie/" + slide.id}>
            <img
              //   onAnimationEnd={handleOnAnimationEnd}
              ref={slideRef}
              className="aspect-video object-cover"
              src={slide.poster}
              alt=""
            />
            <div className="absolute inset-0 flex flex-col justify-end py-3 ">
              <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
                {slide.title}
              </h1>
            </div>
          </Link>
        </div>
        <Link to={"/movie/" + slide.id}>
          <img
            onAnimationEnd={handleOnAnimationEnd}
            ref={clonedSlideRef}
            className="aspect-video object-cover absolute inset-0"
            src={clonedSlide.poster}
            alt=""
          />
        </Link>
        <SlideShowController
          onNextClick={handleOnNextClick}
          onPreviousClick={handleOnPreviousClick}
        />
      </div>
      {/* Up next section */}
      <div className="w-1/5 md:block hidden space-y-3 px-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">
          Up Next
        </h1>
        {upNext.map(({ poster, id }) => {
          return (
            <img
              key={id}
              src={poster}
              alt=""
              className="aspect-video object-cover rounded"
            />
          );
        })}
      </div>
    </div>
  );
}

const SlideShowController = ({ onNextClick, onPreviousClick }) => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button
        onClick={onPreviousClick}
        type="button"
        className="bg-primary rounded border-2 text-white text-xl p-2 outline-none"
      >
        <AiOutlineLeft />
      </button>
      <button
        onClick={onNextClick}
        type="button"
        className="bg-primary rounded border-2 text-white text-xl p-2 outline-none"
      >
        <AiOutlineRight />
      </button>
    </div>
  );
};
