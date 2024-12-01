import React, { useContext, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { Calendar } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_CARD } from "../../graphql/queries/card";
import SpinnerContext from "../../contexts/SpinnerContext";
import CardDetailHeader from "./CardDetailHeader";
import CardDescription from "./CardDescription";
import CardActions from "./CardActions";
import CardContext from "../../contexts/CardContext";

const CardDetailComponent = () => {
  const setShowSpinner = useContext(SpinnerContext);
  const { cardId, onClose } = useContext(CardContext);

  const { data, loading, error } = useQuery(GET_CARD, {
    variables: { id: cardId },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!data) return;
  }, [data]);

  useEffect(() => {
    setShowSpinner(loading);
  }, [loading]);

  if (error) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="rounded-lg bg-white p-6 shadow-xl">
          <p className="text-red-500">
            Error loading card details. Please try again later.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <CardDetailHeader
            title={data?.card?.title || "Untitled"}
            onClose={onClose}
          />

          <p className="mb-4 text-sm text-gray-500">in list {data?.card?.list?.name || "Doing"}</p>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold">DUE DATE</h3>
            <div className="flex items-center rounded bg-gray-100 p-2">
              <Calendar size={16} className="mr-2" />
              <span>Apr 24 at 12:00 PM</span>
            </div>
          </div>

          <CardDescription card={data?.card} />
        </div>

        <CardActions />
      </div>
    </div>
  );
};

const CardDetail = memo(CardDetailComponent);

export default CardDetail;
