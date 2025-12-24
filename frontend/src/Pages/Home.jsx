import React from "react";
import Lefthome from "../components/Lefthome";
import Righthome from "../components/Righthome";
import Feed from "../components/Feed";

function Home() {
  return (
    <div className="w-full flex justify-center items-center">
      <Lefthome />
      <Feed />
      <Righthome />
    </div>
  );
}

export default Home;
