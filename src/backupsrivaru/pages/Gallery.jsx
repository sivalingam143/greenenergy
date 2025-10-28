import React, { useState, useEffect } from "react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import { ClickButton } from "../components/ClickButton";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import Swal from "sweetalert2";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { Buttons } from "../components/ClickButton";
const Gallery = () => {
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({ image: "" });
    const [imageList, setImageList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editImage, setEditImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const BASE_URL = "https://greenenergy.zentexus.in/api/uploads/";

    const closeModal = () => {
        setModal(false);
        setImagePreview(null);
        setFormData({ image: "" });
    };

    const showModal = () => setModal(true);

    const fetchImages = async () => {
        try {
            const response = await axios.get("https://greenenergy.zentexus.in/api/imageweb/list.php");
            setImageList(response.data.images || []);
        } catch (error) {
            toast.error("Failed to fetch images. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleEdit = (image) => {
        setEditImage(image);
        setModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.image) {
            toast.error("Please select an image.");
            return;
        }

        const newFormData = new FormData();
        newFormData.append("image", formData.image);

        try {
            const response = await axios.post(
                "https://greenenergy.zentexus.in/api/imageweb/create.php",
                newFormData
            );

            if (response.data.status === 200) {
                toast.success("Image uploaded successfully.");
                closeModal();

                fetchImages();
            } else {
                toast.error("Failed to upload image.");
            }
        } catch (error) {
            toast.error("Error uploading image.");
        }
    };
    const handleUpdate = async () => {
        if (!formData.image) {
            toast.error("Please select an image.");
            return;
        }

        const newFormData = new FormData();
        newFormData.append("image", formData.image);
        newFormData.append("img_id", editImage.img_id);  // Pass the ID of the image you're editing

        try {
            const response = await axios.post(
                "https://greenenergy.zentexus.in/api/imageweb/update.php",
                newFormData
            );

            if (response.data.status === 200) {
                toast.success("Image updated successfully.");
                closeModal();
                fetchImages(); // Re-fetch the images to get the updated list
            } else {
                toast.error("Failed to update the image.");
            }
        } catch (error) {
            toast.error("Error updating the image.");
        }
    };
    const handleDelete = async (img_id) => {
        if (!img_id) return;

        // Show SweetAlert confirmation dialog
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this image?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: 'my-confirm-button-class',
                cancelButton: 'my-cancel-button-class',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    formData.append("img_id", img_id);

                    const response = await axios.post(
                        "https://greenenergy.zentexus.in/api/imageweb/delete.php",
                        formData
                    );

                    console.log("API Response:", response.data); // Inspect API response
                    if (response.data.status === 200) {
                        // Remove the image from the list
                        setImageList((prevList) => prevList.filter((image) => image.id !== img_id));
                        Swal.fire({
                            title: "Deleted!",
                            text: "The image has been deleted.",
                            icon: "success",
                            customClass: {
                                popup: 'my-popup',  // Custom class for the popup (main container)
                                title: 'my-title',  // Custom class for the title
                                content: 'my-content', // Custom class for the content text
                                icon: 'my-icon', // Custom class for the icon
                                confirmButton: 'my-confirm-button-class',
                                customClass: {
                                    confirmButton: 'my-confirm-button-class',
                                }
                            }
                        }).then(() => {
                            fetchImages();
                        });

                    } else {
                        Swal.fire("Failed!", response.data.message || "Failed to delete the image.", "error");
                    }
                } catch (error) {
                    Swal.fire("Error!", "There was a problem deleting the image.", "error");
                }
            }
        });
    };


    const paginate = (images, pageNumber, itemsPerPage) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        return images.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = Math.ceil(imageList.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <>
            <div id="main">
                <Container fluid>
                    <Row>
                        <Col lg="7" md="4" xs="6">
                            <div className="page-nav py-3">
                                <span className="nav-list">Image Gallery</span>
                            </div>
                        </Col>
                        <Col lg="5" md="3" xs="6" className="align-self-center text-end">
                            <ClickButton label="Add New" onClick={showModal}></ClickButton>
                        </Col>
                    </Row>
                    {/* Display images in column format */}
                    {/* <Row className="mt-4">
                    {isLoading ? (
                        <p>Loading images...</p>
                    ) : imageList.length > 0 ? (
                        imageList.map((image, index) => (
                            <Col key={image.id || index} lg={4} md={4} sm={6} xs={12} className="mb-4">
                                <div className="image-container">
                                    <img
                                        src={`${BASE_URL}${image.image_url}`}
                                        alt={`Gallery ${index}`}
                                        className="img-fluid"
                                    />
                                    <div className="icon-container">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(image)}
                                        >
                                            <FiEdit3 />
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(image.img_id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <p>No images available.</p>
                    )}
                </Row> */}
                    <Row className="mt-4">
                        {isLoading ? (
                            <p>Loading images...</p>
                        ) : imageList.length > 0 ? (
                            paginate(imageList, currentPage, itemsPerPage).map((image, index) => (
                                <Col key={image.id || index} lg={4} md={4} sm={6} xs={12} className="mb-4">
                                    <div className="image-container">
                                        <img
                                            src={`${BASE_URL}${image.image_url}`}
                                            alt={`Gallery ${index}`}
                                            className="img-fluid"
                                        />
                                        <div className="icon-container">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(image)}
                                            >
                                                <FiEdit3 />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(image.img_id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <p>No images available.</p>
                        )}
                    </Row>
                    <Row className="">
                        <Col className="d-flex justify-content-end mt-4 mb-3 ">
                            <div className="text-end">
                                <span className="mx-1">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <span className="mx-1">
                                    <Buttons
                                        lable={
                                            <>
                                                <MdChevronLeft className="icon-style" />
                                            </>
                                        }
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    />
                                </span>
                                <span className="mx-1">
                                    <Buttons
                                        lable={
                                            <>
                                                <MdChevronRight className="icon-style" />
                                            </>
                                        }
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    />
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Modal show={modal} onHide={closeModal} size="md" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label htmlFor="image-upload" className="form-label">
                            Select an Image
                        </label>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                        />
                        {imagePreview && (
                            <div className="mt-3 text-center">
                                <img src={imagePreview} alt="Preview" className="img-fluid" />
                            </div>
                        )}
                        {editImage && !imagePreview && (
                            <div className="mt-3 text-center">
                                <img
                                    src={`${BASE_URL}${editImage.image_url}`}
                                    alt="Current Image"
                                    className="img-fluid"
                                />
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <ClickButton label="Submit" onClick={editImage ? handleUpdate : handleSubmit}></ClickButton>
                        <ClickButton label="Cancel" onClick={closeModal}></ClickButton>
                    </Modal.Footer>
                </Modal>
                <ToastContainer />
            </div>
        </>

    );
};

export default Gallery;
