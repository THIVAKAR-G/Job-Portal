import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';

function formatDate(value) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function JobListPage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const username = localStorage.getItem("username") || "Candidate";

    useEffect(() => {
        fetch("http://192.241.133.222/jobs")
            .then((res) => res.json())
            .then((data) => setJobs(data))
            .catch((err) => console.error("Failed to fetch jobs:", err))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Thiv Portal</h1>
                        <p className="text-sm text-slate-500">Find jobs and apply easily</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">Hello, {username}</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                            {username.slice(0, 1).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Available jobs</h2>
                    <p className="mt-1 text-sm text-slate-500">Browse the latest openings and apply with your details.</p>
                </div>

                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="rounded-xl border bg-white p-5 shadow-sm">
                                <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                                <div className="mt-3 h-4 w-24 animate-pulse rounded bg-slate-100" />
                                <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
                                <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="rounded-xl border bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
                        No jobs found right
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {jobs.map((job) => (
                            <article key={job.id} className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                                        <p className="mt-1 text-sm text-slate-600">{job.company}</p>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                        {formatDate(job.posted_on)}
                                    </span>
                                </div>

                                <p className="mt-4 text-sm leading-6 text-slate-500">
                                    {job.description}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                                    <span className="rounded-md bg-slate-100 px-3 py-1.5">{job.location}</span>
                                    <span className="rounded-md bg-slate-100 px-3 py-1.5">{job.salary_range || "Salary on request"}</span>
                                    <span className="rounded-md bg-slate-100 px-3 py-1.5">Full time</span>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <NavLink
                                        to={`/apply/${job.id}`}
                                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                                    >
                                        Apply
                                    </NavLink>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
