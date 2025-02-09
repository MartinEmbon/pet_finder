// src/components/CoverImage.js
import React from "react";
import PropTypes from "prop-types";


const CoverImage = ({ coverImageUrl }) => {
  if (!coverImageUrl) return null;

  return (
    <div className="cover-image-container">
      <img
        className="event-cover"
        src={coverImageUrl}
        alt="Cover"
        style={{ width: "100%" }}
      />
    </div>
  );
};

CoverImage.propTypes = {
  coverImageUrl: PropTypes.string,
};

export default CoverImage;
