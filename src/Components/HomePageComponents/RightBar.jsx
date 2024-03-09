import { Box } from "@mui/material";
import FriendListCard from "./FriendListCard";

const RightBar = () => {
  return (
    <Box px={2} sx={{ display: { xs: "none", lg: "block" }, flex: 2 }}>
      <Box>
        <FriendListCard></FriendListCard>
      </Box>
    </Box>
  );
};

export default RightBar;
