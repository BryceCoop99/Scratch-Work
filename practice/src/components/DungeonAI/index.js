import React from "react";

function DungeonAI() {
  const data = {
    prompt: "a dnd battleground map --ar 16:9",
  };

  const handleClick = () => {
    console.log("Button clicked!");
    const result = main();
    console.log(result);
  };

  async function main() {
    let promptResponseData;
    // generate the image
    try {
      const response = await fetch(
        "https://cl-95.imagineapi.dev/admin/content/images/",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer 1J-_FWTROcdNLYUzD6Pxocgmd9i0QTqU", // <<<< TODO: remember to change this
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      promptResponseData = await response.json();
      console.log(promptResponseData);
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }

    // check if the image has finished generating
    // let's repeat this code every 5000 milliseconds (5 seconds, set at the bottom)
    const intervalId = setInterval(async function () {
      try {
        console.log("Checking image details");
        const response = await fetch(
          `https://cl-95.imagineapi.dev/admin/content/images/${promptResponseData.data.id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer 1J-_FWTROcdNLYUzD6Pxocgmd9i0QTqU", // <<<< TODO: remember to change this
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();
        if (
          responseData.data.status === "completed" ||
          responseData.data.status === "failed"
        ) {
          // stop repeating
          clearInterval(intervalId);
          console.log("Completed image detials", responseData.data);
        } else {
          console.log(
            "Image is not finished generation. Status: ",
            responseData.data.status
          );
        }
      } catch (error) {
        console.error("Error getting updates", error);
        throw error;
      }
    }, 5000 /* every 5 seconds */);
    // TODO: add a check to ensure this does not run indefinitely
  }

  return (
    <div className="DungeonAI">
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}

export default DungeonAI;
