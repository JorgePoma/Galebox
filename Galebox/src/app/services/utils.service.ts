/*
import { Injectable } from '@angular/core';

const API_URL = "https://backend-qc57.onrender.com";

export const callApi = async (path, method, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body)
  })
  const data = await response.json();

  return data;
}
*/