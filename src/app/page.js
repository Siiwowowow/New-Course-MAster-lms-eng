'use client';
import Image from "next/image";
import Hero from "./component/Hero/Hero";
import MarqueBrand from "./component/marque/MarqueBrand";
import CourseCard from "./component/courseCard/courseCard";
import Review from "./component/Review/Review";
import Teacher from "./component/Teacher/Teacher";
import Promotion from "./component/Promotion/Promotion";
import FAQ from "./component/FAQ/FAQ";

export default function Home() {
  return (
  <div>
    <Hero></Hero>
    <MarqueBrand/>
    <CourseCard/>
    <Promotion/>
    <Teacher/>
     
    <Review/>
   
    <FAQ/>
  </div>
  );
}
