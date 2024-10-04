import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import DefaultLayout from "./Components/SideBar/DefaultLayout";
import Dashboard from "./Components/DashBoard/Dashboard";
import Cars from "./Components/Cars/Cars";
import Drivers from "./Components/Drivers/Drivers";
import Parks from "./Components/Parks/Parks";
import AddDriver from "./Components/Drivers/create_driver";
import AddUser from "./Components/Users/AddUser";
import AddCar from "./Components/Cars/AddCar";
import AddPark from "./Components/Parks/Create_park";
import AllUsers from "./Components/Users/AllUsers";
import CustomFormValidation from "./Components/Login/login"
import EditCar from "./Components/Cars/Edit_car";
import EditPark from "./Components/Parks/EditPark";
import EditDriver from "./Components/Drivers/EditDriver";
import EditUser from "./Components/Users/EditUser";
import ParksAdmin from "./Components/Parks/Admin/ParksAdmin";
import EditServiceInterval from "./Components/Cars/EditInfo";
import PaymentsHistory from "./Components/Payments/PaymentsHistory";
import Calendar from "./Components/Payments/Calendar";
import ImageUpload from "./Components/Parks/Image";
import Registration from "./Components/Registration/Registration";
import PrivateRoute from './PrivateRoute';
import Reset from "./Components/Reset/NewPassword"
import EmailInput from "./Components/Reset/EmailInput";
import KeyError from "./Components/Reset/SecretKey"

const Routing = () => {


  return (
    <Routes>
      <Route path="/login" element={<CustomFormValidation />} />

      <Route path="/email" element={<EmailInput />} />

      <Route path="/change_password/*" element={<Reset />} />

      <Route path="/registration" element={<Registration />} />

      <Route path="/error" element={<KeyError />} />

      {/* <Route path="/change_password" element={<Reset />} /> */}


      <Route path="/dashboard" element={
        <PrivateRoute>
          <DefaultLayout><Dashboard /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/cars" element={
        <PrivateRoute>
          <DefaultLayout><Cars /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/edit_car/:carId" element={
        <PrivateRoute>
          <DefaultLayout><EditCar /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/edit_park/:parkId" element={
        <PrivateRoute>
          <DefaultLayout><EditPark /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/edit_driver/:driverId" element={
        <PrivateRoute>
          <DefaultLayout><EditDriver /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/edit_user/:userId" element={
        <PrivateRoute>
          <DefaultLayout><EditUser /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/edit_info/:carId" element={
        <PrivateRoute>
          <DefaultLayout><EditServiceInterval /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/drivers" element={
        <PrivateRoute>
          <DefaultLayout><Drivers /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/users" element={
        <PrivateRoute>
          <DefaultLayout><AllUsers /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/add_user" element={
        <PrivateRoute>
          <DefaultLayout><AddUser /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/add_car" element={
        <PrivateRoute>
          <DefaultLayout><AddCar /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/add_park" element={
        <PrivateRoute>
          <DefaultLayout><AddPark /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/payments_history" element={
        <PrivateRoute>
          <DefaultLayout><PaymentsHistory /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/calendar" element={
        <PrivateRoute>
          <DefaultLayout><Calendar /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/driver_create" element={
        <PrivateRoute>
          <DefaultLayout><AddDriver /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/parks" element={
        <PrivateRoute>
          <DefaultLayout><Parks /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/image" element={
        <PrivateRoute>
          <DefaultLayout><ImageUpload /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="/choose_driver_park" element={
        <PrivateRoute>
          <DefaultLayout><ParksAdmin /></DefaultLayout>
        </PrivateRoute>
      } />

      <Route path="*" element={
        <PrivateRoute>
          <DefaultLayout>No directory</DefaultLayout>
        </PrivateRoute>
      } />
    </Routes>

  );
};

export default Routing;
