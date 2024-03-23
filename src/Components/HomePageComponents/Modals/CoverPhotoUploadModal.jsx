import React, { useContext, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar, CircularProgress, Divider, InputBase } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Axios from "axios";
import Api from "../../../Utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authContext } from "../../../Context/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "backgroundColor.secondary",
  borderRadius: "15px",
  boxShadow: 24,
  p: 2,
  color: "textColor.main",
  border: "2px solid #333",
  "&:focus": {
    outline: "none",
  },
};

function CoverPhotoUploadModal({ open, handleClose, fetchProfile }) {
  const ctx = useContext(authContext);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [blobURL, setBlobURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastId = useRef(null);

  const uploadImage = ({ target: { files } }) => {
    if (files && files[0]) {
      setFileName(files[0].name);
      const imageURL = URL.createObjectURL(files[0]);
      setBlobURL(imageURL);
      setImage(files[0]);
    }
  };

  const handleClick = () => {
    setIsLoading(true);
    handleClose();
    if (image) {
      toastId.current = toast.loading("Uploading Cover photo...");
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "bdafcwdk");
      setIsLoading(true);
      Axios.post(
        "https://api.cloudinary.com/v1_1/dc1xi4aeb/image/upload",
        formData
      )
        .then((res) => {
          setIsLoading(false);
          Api.put("/auth/accounts/update", {
            bg_pic: res.data.url,
            id: ctx.user._id,
          })
            .then((res) => {
              fetchProfile();
              setBlobURL("");
              setImage(null);
              toast.update(toastId.current, {
                render: "Uploaded sucessfully...",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                closeButton: true,
                pauseOnHover: true,
                draggable: false,
                style: {
                  backgroundColor: "#222831",
                  color: "white",
                },
              });
            })
            .catch((err) => {
              setIsLoading(false);
              // console.log(err.response.data);
            });
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error uploading image:", error);
        });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      margin={2}
      disableScrollLock
    >
      <Box sx={style} width={{ xs: 280, sm: 300 }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            id="modal-modal-title"
            sx={{
              fontSize: "1.2rem",
              width: "100%",
              textAlign: "center",
              mb: 2,
            }}
          >
            Upload Cover Photo
          </Typography>
          <Box display={"flex"} alignItems={"center"} width={"100%"}></Box>

          {/* image select section */}
          <Box mb={2} width={"100%"}>
            <form
              style={{
                border: "3px dotted #999",
                borderRadius: "20px",
                height: 200,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 0px",
              }}
              onClick={() => {
                document.querySelector(".input-field").click();
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="input-field"
                hidden
                onChange={uploadImage}
              />
              {blobURL ? (
                <img src={blobURL} style={{ width: 100 }} />
              ) : (
                <CloudUploadIcon
                  fontSize="large"
                  sx={{ color: "primary.main" }}
                />
              )}
            </form>
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              mt={1}
            >
              <Box display={"flex"} alignItems={"center"}>
                <Typography>{fileName} </Typography>
                {image ? (
                  <DeleteIcon
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => {
                      setFileName("No file selected");
                      setImage(null);
                      setBlobURL("");
                    }}
                  />
                ) : null}
              </Box>
            </Box>
          </Box>
          <Button
            fullWidth
            disabled={!image}
            onClick={handleClick}
            sx={{
              backgroundColor: image ? "primary.main" : "gray",
              color: image ? "textColor.main" : "#000",
              padding: "10px",
              borderRadius: "15px",
              ":hover": {
                backgroundColor: "primary.main",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={"2em"} sx={{ color: "white" }} />
            ) : (
              "Upload"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CoverPhotoUploadModal;
