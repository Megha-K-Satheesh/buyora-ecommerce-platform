import React from "react";

const WelcomeText = React.memo(({ title, subtitle,}) => {
  return (
    <div className="">
      <h1 className="text-5xl font-bold text-center text-white align-middle">
        {title}
      </h1>
      <p className="mt-2 text-shadow-indigo-200 text-center text-white align-middle  ">
        {subtitle}
      </p>
    </div>
  );
});

export default WelcomeText;

