import React from "react";

const WelcomeText = React.memo(({ title, subtitle,}) => {
  return (
    <div className="">
      <h1 className="text-7xl font-bold text-center text-white align-middle">
        {title}
      </h1>
      <p className="mt-2 text-shadow-indigo-200">
        {subtitle}
      </p>
    </div>
  );
});

export default WelcomeText;

