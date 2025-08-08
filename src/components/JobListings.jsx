import JobListing from './JobListing'
import { useState, useEffect } from 'react'
import Spinner from './Spinner'
import jobsData from '../jobs.json'

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const displayedJobs = isHome ? jobsData.jobs.slice(0, 3) : jobsData.jobs;
      setJobs(displayedJobs);
      setLoading(false);
    }, 300); 

    return () => clearTimeout(timer);
  }, [isHome]);
 
  if (loading) {
    return (
      <section className="bg-blue-50 px-4 py-10">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
            {isHome ? 'Recent Jobs' : 'All Jobs'}
          </h2>
          <div className="text-center py-10">
            <Spinner loading={loading}/>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? 'Recent Jobs' : 'All Jobs'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
             <JobListing key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default JobListings