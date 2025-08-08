import { useState, useEffect } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import JobsPage from './pages/JobsPage';
import AddJobPage from './pages/AddJobPage';
import NotFound from './pages/NotFound';
import JobPage, { JobLoader } from './pages/JobPage';
import EditJobPage from './pages/EditJobPage';

const App = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/jobs')
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  const addJob = async (jobData) => {
    const res = await fetch('http://localhost:5000/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    const newJob = await res.json();
    setJobs((prevJobs) => [...prevJobs, newJob]);
    return newJob;
  };

  const deleteJob = async (id) => {
    const res = await fetch(`http://localhost:5000/jobs/${id}`, {
      method: 'DELETE',
    });
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    return res.json();
  };

  const updateJob = async (job) => {
    const res = await fetch(`http://localhost:5000/jobs/${job.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    const updatedJob = await res.json();
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );
    return updatedJob;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage jobs={jobs} />} />
        <Route path="/add-job" element={<AddJobPage addJobSubmit={addJob} />} />
        <Route
          path="/edit-job/:id"
          element={<EditJobPage updateJobSubmit={updateJob} jobs={jobs}/>}
          loader={JobLoader}
        />
        <Route
          path="/jobs/:id"
          element={<JobPage deleteJob={deleteJob} jobs={jobs}/>}
          loader={JobLoader}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
