import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';

const initialForm = {
    full_name: "",
    email: "",
    phone: "",
    years_experience: "0",
    current_company: "",
    cover_letter: "",
};

export default function ApplyJobPage() {
    const { jobId } = useParams();
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username") || "Candidate";
    const userEmail = localStorage.getItem("email") || "";

    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        ...initialForm,
        full_name: username,
        email: userEmail,
    });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetch(`http://192.241.133.222/jobs/${jobId}`)
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Unable to load job details.");
                }
                return res.json();
            })
            .then((data) => setJob(data))
            .catch((error) => setStatus({ type: "error", message: error.message }))
            .finally(() => setIsLoading(false));
    }, [jobId]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsSubmitting(true);
        setStatus({ type: "", message: "" });

        const payload = {
            ...formData,
            applicant: userId,
            job: jobId,
            years_experience: Number(formData.years_experience),
        };

        try {
            const res = await fetch('http://192.241.133.222/apply', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                const message = typeof data === "object"
                    ? data.message || Object.values(data).flat().join(" ")
                    : "Failed to apply";
                throw new Error(message);
            }

            setStatus({
                type: data.email_sent ? "success" : "warning",
                message: data.message || "Application submitted successfully.",
            });
            setShowSuccess(true);
            window.setTimeout(() => setShowSuccess(false), 1800);
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || "Failed to apply.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Job application</h1>
                        <p className="text-sm text-slate-500">Complete your details and submit</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                        {username.slice(0, 1).toUpperCase()}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <NavLink to="/jobs" className="inline-flex text-sm text-slate-600 hover:text-slate-900">
                    Back to jobs
                </NavLink>

                <div className="mt-5 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <section className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Job details</h2>

                        {isLoading ? (
                            <div className="mt-4 space-y-3">
                                <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                            </div>
                        ) : job ? (
                            <div className="mt-4">
                                <h3 className="text-2xl font-semibold text-slate-900">{job.title}</h3>
                                <p className="mt-1 text-sm text-slate-600">{job.company}</p>

                                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                                    <span className="rounded-md bg-slate-100 px-3 py-1.5">{job.location}</span>
                                    <span className="rounded-md bg-slate-100 px-3 py-1.5">{job.salary_range || "Salary on request"}</span>
                                </div>

                                <p className="mt-5 text-sm leading-6 text-slate-500">{job.description}</p>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-rose-600">{status.message || "Job details unavailable."}</p>
                        )}
                    </section>

                    <section className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Applicant details</h2>
                                <p className="mt-1 text-sm text-slate-500">Enter your basic details.</p>
                            </div>
                            {showSuccess && (
                                <div className="success-chip">
                                    <span className="success-dot" />
                                    Applied
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="simple-field">
                                <span>Full name</span>
                                <input
                                    required
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="simple-input"
                                />
                            </label>

                            <label className="simple-field">
                                <span>Email address</span>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="simple-input"
                                />
                            </label>

                            <label className="simple-field">
                                <span>Phone number</span>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="simple-input"
                                />
                            </label>

                            <label className="simple-field">
                                <span>Years of experience</span>
                                <input
                                    required
                                    min="0"
                                    max="60"
                                    type="number"
                                    name="years_experience"
                                    value={formData.years_experience}
                                    onChange={handleChange}
                                    className="simple-input"
                                />
                            </label>

                            <label className="simple-field md:col-span-2">
                                <span>Current company</span>
                                <input
                                    name="current_company"
                                    value={formData.current_company}
                                    onChange={handleChange}
                                    placeholder="Current company name"
                                    className="simple-input"
                                />
                            </label>

                            <label className="simple-field md:col-span-2">
                                <span>Short note</span>
                                <textarea
                                    name="cover_letter"
                                    value={formData.cover_letter}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Write a short note"
                                    className="simple-input min-h-28 resize-y"
                                />
                            </label>

                            <div className="md:col-span-2">
                                <button
                                    disabled={isSubmitting || !userId || !job}
                                    type="submit"
                                    className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Submitting..." : "Apply job"}
                                </button>
                            </div>

                            {status.message && (
                                <div
                                    className={`md:col-span-2 rounded-md px-4 py-3 text-sm ${
                                        status.type === "success"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : status.type === "warning"
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-rose-50 text-rose-700"
                                    }`}
                                >
                                    {status.message}
                                </div>
                            )}
                        </form>
                    </section>
                </div>
            </main>
        </div>
    )
}
