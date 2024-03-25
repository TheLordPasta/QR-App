import React from "react";

interface UserInputDisplayProps {
  cmFromGround: string;
  cmOutOfWall: string;
}

const UserInputDisplay: React.FC<UserInputDisplayProps> = ({
  cmFromGround,
  cmOutOfWall,
}) => {
  return (
    <div>
      {cmFromGround && cmOutOfWall && (
        <p>
          You have submitted {cmFromGround} cm from the ground and {cmOutOfWall}{" "}
          cm out of the wall.
        </p>
      )}
    </div>
  );
};

export default UserInputDisplay;
