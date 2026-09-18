"use client";

import { useUser, useProfile } from "@/context/InternshipContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import UnpublishingInternship from "@/components/UnpublishingInternship";
import {
  getUserByUsername,
  updateInternship,
  checkUsernameAvailability,
  getPublicInternships,
} from "@/tools/firebaseActions.js";
import Image from "next/image.js";
import {
  PenLine,
  GraduationCap,
  MapPin,
  User,
  Briefcase,
  Plus,
  Minus,
  X,
  Wrench,
  Lock,
  LockOpen,
  CircleAlert,
  CirclePlus,
} from "lucide-react";
import { interpolate } from "motion";
import { useInternship } from "@/context/InternshipContext";
import { editProfile } from "@/tools/firebaseActions.js";
import { motion } from "motion/react";

export function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileUsername = searchParams.get("u");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const { internships } = useInternship();
  const [editing, setEditing] = useState({
    main: false,
    about: false,
    technicalSkills: false,
  });
  const { profile } = useProfile();
  const [formData, setFormData] = useState({
    about: profile.about || "",
    displayName: profile.displayName || "",
    institution: profile.institution || "",
    location: profile.location || "",
    technicalSkills: profile.technicalSkills || [],
    username: profile.username || "",
  });
  const [technicalSkillsInput, setTechnicalSkillsInput] = useState("");

  const [isAvailable, setIsAvailable] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const [publishingInternships, setPublishingInternships] = useState(false);

  const [unpublishingInternship, setUnpublishingInternship] = useState({
    active: false,
    internship: null,
  });

  const publicInternships =
    profileData?.internships?.filter((internship) => internship.isPublic) || [];
  const publishableInternships =
    profileData?.internships?.filter(
      (internship) => internship.status === "finalized" && !internship.isPublic,
    ) || [];
  const [formInternships, setFormInternships] = useState(() => {
    let form = {};
    publishableInternships.forEach((intern) => {
      form = {
        [intern.id]: false,
        ...form,
      };
    });

    return form;
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      if (profileUsername) {
        setIsLoading(true);
        const data = await getUserByUsername(profileUsername);
        if (!data) {
          setProfileData(null);
          setIsLoading(false);
          return;
        }
        if (data.id === user?.uid) {
          setProfileData({
            id: user.uid,
            internships: internships,
            ...profile,
          });
        } else {
          const peerInternships = await getPublicInternships(data.id);

          setProfileData({
            ...data,
            internships: peerInternships,
          });
        }

        setIsLoading(false);
      }
    }
    loadProfile();
  }, [profileUsername, user, internships, profile, router]);

  useEffect(() => {
    const prepareUI = async () => {
      if (formData.username === user?.username) {
        setIsAvailable(true);
        setIsChecking(false);
        setUsernameMessage("");
      } else {
        setIsAvailable(null); // Clear previous status visually
        setIsChecking(true);
        setUsernameMessage("");
      }
    };

    prepareUI();

    if (formData.username === user?.username) return;

    // The Debounce Timer: Wait 500ms after they stop typing
    const delayDebounceFn = setTimeout(async () => {
      if (formData.username.length >= 4) {
        const available = await checkUsernameAvailability(formData.username);
        if (!available) {
          setUsernameMessage("This username is not available");
        }
        setIsAvailable(available);
      } else {
        setIsAvailable(false); // Too short
        setUsernameMessage(
          "The username must contain at least four characters",
        );
      }
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.username, user?.username]);

  const handleMainChanges = async () => {
    if (isAvailable) {
      let usernameChanged = false;
      if (formData.username !== user?.username)
        await editProfile("username", formData.username, user);
      usernameChanged = true;
      if (formData.displayName !== user?.displayName)
        await editProfile("displayName", formData.displayName, user);
      if (formData.institution !== user?.institution)
        await editProfile("institution", formData.institution, user);
      if (formData.location !== user?.location)
        await editProfile("location", formData.location, user);
      if (usernameChanged) {
        // Using just "?u=" keeps them on the same page but changes the query
        router.replace(`?u=${formData.username}`);
      }
    }
  };
  useEffect(() => {
    console.log(formData.technicalSkills);
    console.log(profile, profileData);
  }, [formData.technicalSkills, profile, profileData]);

  return (
    <main className="flex flex-col pt-52 sm:pt-28 font-sans min-h-screen w-full h-full  p-8 bg-slate-50 gap-8">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center text-black ">
          Loading profile...:
        </div>
      ) : !profileData ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
          <User className="w-12 h-12 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
          <p>This profile does not exist or the username was changed.</p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-8">
          {unpublishingInternship.active && (
            <UnpublishingInternship
              setUnpublishingInternship={setUnpublishingInternship}
              unpublishingInternship={unpublishingInternship}
              user={user}
            ></UnpublishingInternship>
          )}
          {user.uid === profileData.id && (
            <div className="absolute text-black right-0 top-3 flex flex-row items-center gap-2 p-2 bg-slate-100 rounded-lg">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 font-medium text-lg ${profile.isPublic ? "bg-slate-100 cursor-pointer" : "bg-white "} `}
                onClick={() => {
                  editProfile("isPublic", false, user);
                }}
              >
                <Lock className=" w-5 h-5 font-semibold text-gray-600"></Lock>
                <span>Private</span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 font-medium text-lg ${profile.isPublic ? "bg-white" : "bg-slate-100 cursor-pointer"} `}
                onClick={() => {
                  editProfile("isPublic", true, user);
                }}
              >
                <LockOpen className=" w-5 h-5 font-semibold text-gray-600"></LockOpen>
                <span>Public</span>
              </div>
            </div>
          )}
          {user.uid === profileData.id && (
            <div className="mt-14">
              {profile.isPublic ? (
                <div className="flex flex-col gap-4 px-7 py-8 rounded-2xl border-2 border-gray-200 overflow-hidden mt-10">
                  <div className="uppercase flex gap-3 items-center ">
                    <LockOpen className="w-6 h-6 text-gray-500" />
                    <span className="text-gray-500 text-lg font-semibold">
                      Your profile status
                    </span>
                  </div>
                  <div className="text-md text-gray-600">
                    Your profile is public. You are now visible to peers and
                    entities.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 px-7 py-8 rounded-2xl border-2 border-gray-200 overflow-hidden mt-10">
                  <div className="uppercase flex gap-3 items-center ">
                    <Lock className="w-6 h-6 text-gray-600" />
                    <span className="text-gray-500 text-lg font-semibold">
                      Your profile status
                    </span>
                  </div>
                  <div className="text-md text-gray-600">
                    Your profile is private. Make it public so peers and
                    professionals can notice you.
                  </div>
                </div>
              )}
            </div>
          )}

          <section className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="h-48 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 relative w-full">
              <div className="absolute -bottom-13 left-6 bg-white rounded-full p-1 w-26 h-26 flex items-center justify-center z-20">
                {profileData?.photoURL ? (
                  <Image
                    alt="Profile"
                    src={profileData.photoURL}
                    width={100}
                    height={100}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {profileData?.username?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full p-8 relative pt-16 bg-white flex flex-col">
              {user.uid === profileData.id && !editing.main && (
                <button
                  className="flex items-center gap-3 text-gray-800 absolute top-4 right-4  border text-md border-gray-300 rounded-lg px-5 py-1.5 hover:shadow-md bg-slate-50 hover:bg-blue-50 transition-all cursor-pointer font-medium"
                  onClick={() => {
                    const newEditing = {
                      ...editing,
                      main: true,
                    };
                    setEditing(newEditing);

                    setFormData({
                      about: profile?.about || "",
                      displayName: profile?.displayName || "",
                      institution: profile?.institution || "",
                      location: profile?.location || "",
                      technicalSkills: profile?.technicalSkills || "",
                      username: profile?.username || "",
                    });
                  }}
                >
                  <PenLine className="w-4 h-4 text-gray-700" />
                  Edit Profile
                </button>
              )}
              {editing.main ? (
                <input
                  className="text-xl text-gray-700 focus:outline-none bg-gray-100 focus:bg-white focus:ring-3  ring-blue-50 rounded-lg font-medium px-3 py-1 w-70"
                  value={formData.displayName}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }));
                  }}
                />
              ) : (
                <div className="text-black text-2xl font-black">
                  {profileData?.displayName}
                </div>
              )}
              {editing.main ? (
                <>
                  <input
                    className=" text-gray-700 focus:outline-none bg-gray-100 focus:bg-white focus:ring-3  ring-blue-50 rounded-lg font-medium mt-4 px-3 py-0.75 w-70"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }));
                      console.log(isAvailable);
                      console.log(usernameMessage);
                    }}
                  ></input>
                  {!isAvailable && (
                    <div className="text-red-600 text-md flex flex-row gap-2 items-center mt-2 mb-2">
                      <CircleAlert className="w-4 h-4"></CircleAlert>
                      <span>{usernameMessage}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-blue-800 font-medium">
                  @{profileData?.username}
                </div>
              )}

              <div className="flex gap-5">
                <div className="flex items-center gap-2 text-gray-600 font-medium mt-2 bg-indigo-50 rounded-lg px-3 py-1.5">
                  <GraduationCap className="w-4 h-4" />
                  {editing.main ? (
                    <input
                      className="text-md text-gray-700 focus:outline-none bg-gray-100 focus:bg-white focus:ring-3  ring-blue-50 rounded-lg font-medium px-3 py-0.5 w-40"
                      value={formData.institution}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          institution: e.target.value,
                        }));
                      }}
                    />
                  ) : (
                    <span> {profileData?.institution}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-medium mt-2 bg-indigo-50 rounded-lg px-3 py-1.5">
                  <MapPin className="w-4 h-4" />
                  {editing.main ? (
                    <input
                      className="text-md text-gray-700 focus:outline-none bg-gray-100 focus:bg-white focus:ring-3  ring-blue-50 rounded-lg font-medium px-3 py-0.5 w-40"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }));
                      }}
                    />
                  ) : (
                    <span> {profileData?.location}</span>
                  )}
                </div>
              </div>
              {editing.main && (
                <div className="flex gap-3 items-center mt-3 justify-end pr-4">
                  <button
                    className="text-red-600 font-medium text-lg rounded-lg hover:bg-slate-50 transition-all px-4 py-2 cursor-pointer"
                    onClick={() => {
                      const newEditing = { ...editing, main: false };
                      setEditing(newEditing);
                      setFormData(() => ({
                        displayName: profile.displayName,
                        username: profile.username,
                        institution: profile.institution,
                        location: profile.location,
                      }));
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-blue-600 font-medium text-lg rounded-lg hover:bg-slate-50 transition-all px-4 py-2 cursor-pointer"
                    onClick={() => {
                      if (!isAvailable) return;
                      handleMainChanges();
                      setEditing((prev) => ({
                        ...prev,
                        main: false,
                      }));
                    }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </section>
          <section className="rounded-2xl border border-gray-200 overflow-hidden p-8 bg-white relative">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-800 text-lg">About</span>
            </div>
            {user.uid === profileData.id && (
              <button
                className="flex items-center gap-3 text-gray-800 absolute top-4 right-4  border text-md border-gray-300 rounded-lg px-5 py-1.5 hover:shadow-md bg-slate-50 hover:bg-blue-50 transition-all cursor-pointer font-medium"
                onClick={() => {
                  setEditing((prev) => ({
                    ...prev,
                    about: true,
                  }));
                  setFormData({
                    about: profile?.about || "",
                    displayName: profile?.displayName || "",
                    institution: profile?.institution || "",
                    location: profile?.location || "",
                    technicalSkills: profile?.technicalSkills || "",
                    username: profile?.username || "",
                  });
                }}
              >
                <PenLine className="w-4 h-4 text-gray-700" />
                Edit
              </button>
            )}

            {editing.about ? (
              <textarea
                className=" text-gray-700 focus:outline-none bg-gray-100 focus:bg-white focus:ring-3  ring-blue-50 rounded-lg font-medium px-4 py-3 w-full"
                rows={4}
                value={formData.about}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    about: e.target.value,
                  }));
                }}
              ></textarea>
            ) : (
              <div className="text-gray-500 ">{profileData?.about}</div>
            )}

            {editing.about && (
              <div className="flex gap-3 items-center mt-3 justify-end pr-4">
                <button
                  className="text-red-600 font-medium text-lg rounded-lg hover:bg-slate-50 transition-all px-4 py-2 cursor-pointer"
                  onClick={() => {
                    const newEditing = { ...editing, about: false };
                    setEditing(newEditing);
                    setFormData(() => ({
                      displayName: profile.displayName,
                      username: profile.username,
                      institution: profile.institution,
                      location: profile.location,
                    }));
                  }}
                >
                  Cancel
                </button>
                <button
                  className="text-blue-600 font-medium text-lg rounded-lg hover:bg-slate-50 transition-all px-4 py-2 cursor-pointer"
                  onClick={() => {
                    editProfile("about", formData.about, user);

                    setEditing((prev) => ({
                      ...prev,
                      about: false,
                    }));
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </section>
          {(user.uid === profileData.id || publicInternships.length > 0) && (
            <section className="rounded-2xl border border-gray-200 overflow-hidden p-8 bg-white">
              {publishingInternships && (
                <div className="mb-4 flex flex-col gap-5">
                  <div className="border-2 border-slate-300 rounded-xl ">
                    {publishableInternships.map((internship) => {
                      return (
                        <div key={`publishing-${internship.id}`}>
                          {!formInternships[internship.id] && (
                            <div
                              className="border-b-2  py-2 px-5 flex rounded-lg hover:bg-slate-50 justify-between items-center transition-all cursor-pointer"
                              onClick={() => {
                                const newForm = {
                                  ...formInternships,
                                  [internship.id]: true,
                                };
                                setFormInternships(newForm);
                              }}
                            >
                              <div className="flex flex-col gap-2 items-baseline">
                                <div className="font-medium text-lg text-gray-700">
                                  {internship.company}
                                </div>
                                <div className="text-gray-600">
                                  {internship.role}
                                </div>
                              </div>
                              <Plus className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          {formInternships[internship.id] && (
                            <div
                              className="border-b-2  py-2 px-5 flex rounded-lg bg-green-100 hover:bg-green-200 justify-between items-center transition-all cursor-pointer"
                              onClick={() => {
                                const newForm = {
                                  ...formInternships,
                                  [internship.id]: false,
                                };
                                setFormInternships(newForm);
                              }}
                            >
                              <div className="flex flex-col gap-2 items-baseline">
                                <div className="font-medium text-lg text-gray-700">
                                  {internship.company}
                                </div>
                                <div className="text-gray-600">
                                  {internship.role}
                                </div>
                              </div>
                              <Minus className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <button
                      className="text-red-600 hover:bg-slate-100 px-6 py-3 text-xl font-semibold cursor-pointer rounded-lg"
                      onClick={() => {
                        setPublishingInternships(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-3  text-blue-600 bg text-xl font-semibold hover:bg-slate-100 cursor-pointer rounded-lg"
                      onClick={() => {
                        Object.entries(formInternships).forEach(
                          ([id, isActive]) => {
                            if (isActive) {
                              updateInternship(
                                id,
                                { isPublic: isActive },
                                user,
                              );
                            }
                          },
                        );
                        setPublishingInternships(false);
                      }}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              )}
              {!publishingInternships && (
                <>
                  {publicInternships.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-gray-600"></Briefcase>
                          <span className="font-bold text-gray-800 text-lg">
                            Internship log
                          </span>
                        </div>
                        {publishableInternships.length > 0 && (
                          <button
                            className="flex items-center gap-3 text-gray-800 border text-md border-gray-300 rounded-lg px-5 py-1.5 hover:shadow-md bg-slate-50 hover:bg-blue-50 transition-all cursor-pointer font-medium"
                            onClick={() => {
                              setPublishingInternships(true);
                            }}
                          >
                            <CirclePlus className="w-4 h-4 text-gray-700" />
                            Publish
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 w-full">
                        {publicInternships.map((internship) => (
                          <div
                            key={internship.id}
                            className="border border-gray-200 rounded-lg p-4 relative w-full"
                          >
                            {user.uid === profileData.id && (
                              <X
                                className="absolute top-1 right-1 p-1.5 text-red-700 w-8 h-8 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
                                onClick={() => {
                                  setUnpublishingInternship({
                                    active: true,
                                    internship: internship,
                                  });
                                }}
                              ></X>
                            )}

                            <h3 className="font-bold text-gray-800">
                              {internship.role}
                            </h3>
                            <p className="text-gray-600">
                              {internship.company}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-500 py-20">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                      <p className="font-bold text-gray-500 text-lg">
                        Internship Experiences
                      </p>
                      <p className="text-gray-500">
                        {publishableInternships.length === 0
                          ? "No publishable internships to display. Finalize your internships on your dashboard to publish them."
                          : "Publish your publishable internships to make them visible here."}
                      </p>
                      {publishableInternships.length > 0 && (
                        <button
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          onClick={() => setPublishingInternships(true)}
                        >
                          Publish Internships
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          )}
          {(profileData.id === user.uid ||
            profileData.technicalSkills.length > 0) && (
            <section className="rounded-2xl border border-gray-200 overflow-hidden p-8 bg-white relative">
              <div className="flex gap-3 items-center">
                <Wrench className="w-5 h-5 text-gray-600"></Wrench>
                <span className="font-bold text-gray-800 text-lg">
                  Technical Skills and Knowledge
                </span>
              </div>
              {user.uid === profileData.id && !editing.technicalSkills && (
                <button
                  className="flex items-center gap-3 text-gray-800 absolute top-4 right-4  border text-md border-gray-300 rounded-lg px-5 py-1.5 hover:shadow-md bg-slate-50 hover:bg-blue-50 transition-all cursor-pointer font-medium"
                  onClick={() => {
                    setEditing((prev) => ({
                      ...prev,
                      technicalSkills: true,
                    }));
                    setFormData((prev) => ({
                      ...prev,
                      technicalSkills: profile?.technicalSkills || [],
                    }));
                  }}
                >
                  <PenLine className="w-4 h-4 text-gray-700" />
                  Edit
                </button>
              )}

              <div className="flex flex-nowrap items-center gap-3 mt-6">
                {!editing.technicalSkills &&
                  profileData.technicalSkills.map((skill) => {
                    return (
                      <div
                        key={skill}
                        className={`bg-green-50 px-3  py-1.5 rounded-xl text-md font-medium text-gray-700 relative`}
                      >
                        {skill}
                      </div>
                    );
                  })}
                {editing.technicalSkills &&
                  formData.technicalSkills.map((skill) => {
                    console.log(skill);
                    return (
                      <div
                        key={skill}
                        className="bg-white border border-slate-300 px-3  py-1.5 pr-5 rounded-xl text-md font-medium text-gray-700 cursor-pointer relative hover:bg-gray-100 transition-all"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            technicalSkills: prev.technicalSkills.filter(
                              (s) => s !== skill,
                            ),
                          }));
                        }}
                      >
                        <X className="absolute top-0.5 right-0.5 text-red-600 w-4 h-4"></X>

                        {skill}
                      </div>
                    );
                  })}
              </div>

              {editing.technicalSkills && (
                <div>
                  <div className="flex items-center gap-4 mt-6">
                    <input
                      className="bg-gray-100 focus:bg-white text-gray-700 px-4 py-1.5 rounded-lg focus:ring-2 focus:outline-none focus:ring-slate-300"
                      placeholder="Python, General relativity..."
                      value={technicalSkillsInput}
                      onKeyDown={(key) => {
                        if (key === "Enter") {
                          if (technicalSkillsInput === "") return;
                          const newTechnicalSkills = [
                            ...formData.technicalSkills,
                          ];
                          newTechnicalSkills.push(technicalSkillsInput);
                          setFormData((prev) => ({
                            ...prev,
                            technicalSkills: newTechnicalSkills,
                          }));
                          setTechnicalSkillsInput("");
                        }
                      }}
                      onChange={(e) => {
                        setTechnicalSkillsInput(e.target.value);
                      }}
                    />
                    <button
                      className="px-4 py-1.5 rounded-lg text-white bg-blue-500 font-medium"
                      onClick={() => {
                        if (technicalSkillsInput === "") return;
                        const newTechnicalSkills = [
                          ...formData.technicalSkills,
                        ];
                        newTechnicalSkills.push(technicalSkillsInput);
                        setFormData((prev) => ({
                          ...prev,
                          technicalSkills: newTechnicalSkills,
                        }));
                        setTechnicalSkillsInput("");
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-3 items-center mt-3 justify-end pr-4">
                    <button
                      className="text-red-600 font-medium text-lg rounded-lg hover:bg-slate-50 transition-all px-4 py-2 cursor-pointer"
                      onClick={() => {
                        const newEditing = {
                          ...editing,
                          technicalSkills: false,
                        };
                        setEditing(newEditing);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-blue-600 font-medium text-lg rounded-lg hover:bg-slate-50 transition-all px-4 py-2 cursor-pointer"
                      onClick={() => {
                        editProfile(
                          "technicalSkills",
                          formData.technicalSkills,
                          user,
                        );

                        setEditing((prev) => ({
                          ...prev,
                          technicalSkills: false,
                        }));
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
export default function Profile() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading profile...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
