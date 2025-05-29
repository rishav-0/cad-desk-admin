"use client";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const UserTable = ({ allforms }) => {
  const [formlist, setFormlist] = useState(allforms);
  const [activeDescriptionId, setActiveDescriptionId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [remarksDialog, setRemarksDialog] = useState({
    open: false,
    userId: null,
    remarks: "",
  });

  const toggleDescription = (userId) => {
    setActiveDescriptionId(activeDescriptionId === userId ? null : userId);
  };

  const openRemarksDialog = (userId, currentRemarks = "") => {
    setRemarksDialog({
      open: true,
      userId,
      remarks: currentRemarks,
    });
  };

  const closeRemarksDialog = () => {
    setRemarksDialog({
      open: false,
      userId: null,
      remarks: "",
    });
  };

  const handleRemarksChange = (e) => {
    if (e.target.value.length <= 250) {
      setRemarksDialog({
        ...remarksDialog,
        remarks: e.target.value,
      });
    }
  };

  const saveRemarks = async () => {
    const { userId, remarks } = remarksDialog;
    if (!userId) return;

    setUpdatingId(userId);
    setUpdateError(null);

    try {
      await updateDoc(doc(db, "enquiry", userId), {
        status: "remarks",
        remarks,
      });

      setFormlist((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "remarks", remarks } : user
        )
      );

      closeRemarksDialog();
    } catch (error) {
      console.error("Error saving remarks:", error);
      setUpdateError(`Failed to save remarks for ID ${userId}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === "remarks") {
      const currentUser = formlist.find((user) => user.id === id);
      openRemarksDialog(id, currentUser?.remarks || "");
      return;
    }

    setUpdatingId(id);
    setUpdateError(null);

    try {
      await updateDoc(doc(db, "enquiry", id), {
        status: newStatus,
        remarks: "",
      });

      setFormlist(
        formlist.map((user) =>
          user.id === id
            ? {
                ...user,
                status: newStatus,
                remarks: "",
              }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateError(`Failed to update status for ID ${id}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex items-center border border-accent justify-center ">
      {/* Remarks Dialog */}
      {remarksDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Remarks</h3>
            <textarea
              value={remarksDialog.remarks}
              onChange={handleRemarksChange}
              className="w-full border rounded p-2 mb-2 h-32"
              placeholder="Enter remarks (max 250 characters)"
              maxLength={250}
            />
            <div className="text-sm text-gray-500 mb-4">
              {remarksDialog.remarks.length}/250 characters
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeRemarksDialog}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveRemarks}
                disabled={updatingId === remarksDialog.userId}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {updatingId === remarksDialog.userId ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Remarks"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="items-center w-full mx-auto bg-white rounded-lg sm:max-w-4xl">
        <div className="mx-auto">
          {updateError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{updateError}</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="flex text-gray-700 justify-between rounded-lg p-4 bg-white w-full items-center space-x-16">
              <div className="flex items-center">
                <div className="flex font-medium text-sm rounded-full">
                  <p>
                    Results 1 - {formlist.length} of {formlist.length}
                  </p>
                </div>
              </div>
              <div>
                <form>
                  <div className="relative">
                    <select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      className="block appearance-none w-full text-sm bg-gray-100 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 text-sm right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 16L6 10H18L12 16Z"></path>
                      </svg>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <table className="w-full table-auto">
              <thead>
                <tr className="text-sm font-normal text-gray-600 border-t border-b text-left bg-gray-50">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {formlist.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr
                      className="py-10 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
                      onClick={() => toggleDescription(user.id)}
                    >
                      <td className="flex flex-row items-center px-4 py-4">
                        <div className="flex-1 pl-1">
                          <div className="font-medium dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-blue-600 dark:text-gray-200">
                            <a
                              href={`tel:${user.phone}`}
                              className="hover:underline"
                            >
                              {user.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:underline"
                        >
                          {user.email}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                user.status === "pending"
                                  ? "bg-orange-500"
                                  : user.status === "connected"
                                  ? "bg-green-500"
                                  : user.status === "rejected"
                                  ? "bg-red-500"
                                  : "bg-orange-500"
                              }`}
                            ></div>
                            <div className="relative">
                              <select
                                value={user.status || "pending"}
                                onChange={(e) =>
                                  handleStatusUpdate(user.id, e.target.value)
                                }
                                disabled={updatingId === user.id}
                                className={`block appearance-none bg-white  ${
                                  user.status === "pending"
                                    ? "border-orange-300 text-orange-700"
                                    : user.status === "connected"
                                    ? "border-green-300 text-green-700"
                                    : user.status === "rejected"
                                    ? "border-red-300 text-red-700"
                                    : "border-orange-300 text-orange-700"
                                } text-sm py-1 pl-2 pr-8 rounded focus:outline-none focus:ring-1 ${
                                  user.status === "pending"
                                    ? "focus:ring-orange-500"
                                    : user.status === "connected"
                                    ? "focus:ring-green-500"
                                    : user.status === "rejected"
                                    ? "focus:ring-red-500"
                                    : "focus:ring-orange-500"
                                }`}
                              >
                                <option
                                  value="pending"
                                  className="text-orange-500"
                                >
                                  Pending
                                </option>
                                <option
                                  value="connected"
                                  className="text-green-500"
                                >
                                  Connected
                                </option>
                                <option
                                  value="rejected"
                                  className="text-red-500"
                                >
                                  Rejected
                                </option>
                                <option
                                  value="remarks"
                                  className="text-orange-500"
                                >
                                  Remarks
                                </option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                {updatingId === user.id ? (
                                  <svg
                                    className="animate-spin h-4 w-4 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          id={`${user.id}Toggle`}
                          className="text-white border-accent border rounded-lg p-1 text-center inline-flex items-center"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              activeDescriptionId === user.id
                                ? "rotate-180"
                                : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"></path>
                          </svg>
                        </div>
                      </td>
                    </tr>
                    <tr
                      id={`${user.id}Description`}
                      className={`py-4 px-4 border-y border-gray-200 ${
                        activeDescriptionId === user.id ? "" : "hidden"
                      }`}
                    >
                      <td colSpan="4" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold">Courses:</p>
                            <p>{user.courses?.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Qualification:</p>
                            <p>{user?.qualification}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Sources:</p>
                            <p>{user.sources?.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Address:</p>
                            <p>{user?.address}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Batch Time:</p>
                            <p>{user?.batchTime}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Date of Birth:</p>
                            <p>{user?.dob}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Office/College:</p>
                            <p>{user?.office}</p>
                          </div>
                          <div>
                            <a
                              href={`tel:${user.phone}`}
                              className="hover:underline"
                            >
                              <i className="fas fa-phone border p-2 cursor-pointer text-green-500 rounded-lg border-green-400"></i>
                            </a>
                          </div>
                          {user.status === "remarks" && user.remarks && (
                            <div className="">
                              <p className="font-semibold">Remarks:</p>
                              <p>{user.remarks}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
