import { useEffect, useState } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  CreateCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../redux/thunks/admin";


import { Icon } from "@iconify/react";

import {
  SelectAllCategories,
  SelectCategoryloading,
  selectIsUpdatedLoader,
} from "../../redux/reducers/adminSlice";
import Loader from "../../components/Loader";

const Categories = () => {
  const categories = useAppSelector(SelectAllCategories);
  const isSubmitting = useAppSelector(selectIsUpdatedLoader);
  const loading = useAppSelector(SelectCategoryloading);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // In your component
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleAddCategory = async (e: any) => {
    e.preventDefault();

    const trimmedCategory = category.trim();

    // Validation for blank or whitespace-only input
    if (!trimmedCategory) {
      setCategoryError(
        "Il nome della categoria non può essere vuoto o solo spazi."
      );
      return;
    }

    setCategoryError(null); // Clear previous errors if any

    const resultAction = await dispatch(
      CreateCategory({ category: trimmedCategory })
    );

    if (CreateCategory.fulfilled.match(resultAction)) {
      dispatch(getAllCategories());
      setShowModal(false);
      setCategory("");
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    await dispatch(deleteCategory({ _id: catId }));
    dispatch(getAllCategories()); // Refresh the list after delete
  };

  const handleUpdateCategory = async (catId: string) => {
    await dispatch(
      updateCategory({
        _id: catId,

        category: editValue,
      })
    );
    dispatch(getAllCategories()); // Refresh the list after update
    setEditingId(null);
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <DynamicMenu />

          <div className="col-12 col-md-9">
            <div className="form_container">
              <div className="row">
                <div className="col-12 mb-3">
                  <h5>Categorie</h5>

                  <hr />
                </div>
              </div>
              <div className="col-12 col-md-9">
                {/* Trigger Button */}
                <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
                  {categories && categories.length > 0 ? (
                    categories.map((cat: any) => (
                      <div
                        key={cat._id}
                        className="rounded bg-white border border-black text-black ps-3 py-2 fs-6 fw-medium cursor-pointer"
                      >
                        {editingId === cat._id ? (
                          <>
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="me-2 border border-0 border-bottom border-black outline-none"
                            />
                            <Icon
                              icon="ic:round-check"
                              width="24"
                              height="24"
                              onClick={() => {
                                handleUpdateCategory(cat._id);
                                setEditingId(null);
                              }}
                              style={{ cursor: "pointer" }}
                            />
                            <Icon
                              icon="charm:cross"
                              width="25"
                              height="25"
                              onClick={() => setEditingId(null)} // <-- This closes the input
                              style={{ cursor: "pointer" }}
                            />
                          </>
                        ) : (
                          <>
                            <span>{cat.category}</span>
                            <Icon
                              icon="material-symbols:edit-outline-rounded"
                              width="20"
                              height="20"
                              className="ms-3 me-1"
                              onClick={() => {
                                setEditingId(cat._id);
                                setEditValue(cat.category);
                              }}
                              style={{ cursor: "pointer" }}
                            />
                            <Icon
                              icon="charm:cross"
                              width="25"
                              height="25"
                              onClick={() => handleDeleteCategory(cat._id)}
                              style={{ cursor: "pointer" }}
                            />
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <span>No categories found.</span>
                  )}
                </div>

                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Aggiungi categorie
                  </button>
                </div>

                {/* Modal */}
                {showModal && (
                  <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                    tabIndex={-1}
                    role="dialog"
                    aria-labelledby="addCategory"
                    aria-modal="true"
                  >
                    <div className="modal-dialog modal-lg" role="document">
                      <div className="modal-content">
                        <form onSubmit={handleAddCategory}>
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addCategory">
                              Aggiungi categoria
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowModal(false)}
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="form_container form_in_modal">
                              <div className="row">
                                <div className="col-12 mb-3">
                                  <h5>Crea una categoria</h5>
                                  <p>
                                    Compila il campo per creare una nuova
                                    categoria
                                  </p>
                                  <hr />
                                </div>
                              </div>
                              <div className="row mb-3">
                                <div className="col-12">
                                  <div className="former_row">
                                    <label
                                      htmlFor="category"
                                      className="form-label"
                                    >
                                      Nome categoria{" "}
                                      <span className="mandatory">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="category"
                                      value={category}
                                      onChange={(e) =>
                                        setCategory(e.target.value)
                                      }
                                      required
                                    />
                                    {categoryError && (
                                      <small className=" mt-1 text-danger">
                                        {categoryError}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="submit"
                              className="btn btn-dark"
                              disabled={!category || isSubmitting}
                            >
                              Salva
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
