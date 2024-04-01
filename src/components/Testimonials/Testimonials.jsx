import React from "react";
import "./Testimonials.css";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

import AVTR1 from "../../assets/avatar1.jpg";
import AVTR2 from "../../assets/avatar2.jpg";
import AVTR3 from "../../assets/avatar3.jpg";
import AVTR4 from "../../assets/avatar4.jpg";

import { Navigation } from "swiper";

// Import Swiper styles

const data = [
  {
    avatar: AVTR1,
    name: "Tina Show",
    review:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, cupiditate. Atque non hic maxime assumenda perferendis, maiores eum iure repudiandae aspernatur similique pariatur animi provident facere earum nihil eaque quidem",
  },
  {
    avatar: AVTR2,
    name: "Shata Wale",
    review:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, cupiditate. Atque non hic maxime assumenda perferendis, maiores eum iure repudiandae aspernatur similique pariatur animi provident facere earum nihil eaque quidem",
  },
  {
    avatar: AVTR3,
    name: "Ernest Achiever",
    review:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, cupiditate. Atque non hic maxime assumenda perferendis, maiores eum iure repudiandae aspernatur similique pariatur animi provident facere earum nihil eaque quidem",
  },
  {
    avatar: AVTR4,
    name: "Alejandro Torres",
    review:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, cupiditate. Atque non hic maxime assumenda perferendis, maiores eum iure repudiandae aspernatur similique pariatur animi provident facere earum nihil eaque quidem",
  },
];

function Testimonials() {
  return (
    <section id="testimonials">
      <h5>Review from clients</h5>
      <h2>Testimonials</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={40}
        slidesPerView={1}
        navigation={true}
        className="container testimonials__container"
      >
        {data.map(({ avatar, name, review }, index) => {
          return (
            <SwiperSlide key={index} className="testimonial">
              <div className="client__avatar">
                <img src={avatar} alt="Avatar One" />
              </div>
              <h5>{name}</h5>
              <small className="client__review">{review}</small>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

export default Testimonials;
