import axios from "axios";
import { useContext, useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import Loader from "../component/Loader";
import { UserContext } from "../App";
import AboutUser from "../component/about";
import PageNotFound from "./404Page";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    email: "",
    username: "",
    bio: "",
    profile_img: ""
  },
  social_links: {},
  Categories: [],
  joinedAt: " "
};

const ProfilePage = () => {
  const { id: profileId } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);

  const { userAuth: { username } } = useContext(UserContext);

  const { personal_info: { fullname, username: profile_username, profile_img, bio }, social_links, joinedAt } = profile;

  const fetchUserProfile = useCallback(() => {
    axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/get-profile`, { username: profileId })
      .then(({ data: user }) => {
        if (user) {
          setProfile(user);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      });
  }, [profileId]);

  useEffect(() => {
    setProfile(profileDataStructure);
    setLoading(true);
    fetchUserProfile();
  }, [profileId, fetchUserProfile]);

  if (loading) return <Loader />;

  if (!profile_username) return <PageNotFound />;

  return (
    <section className="h-cover md:flex md:flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
      
      <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
        
        <img
          src={profile_img}
          alt={`${profile_username}'s profile`}
          className="w-48 h-48 bg-grey border rounded-full md:w-32 md:h-32"
        />

        <h1 className="text-2xl font-medium">@{profile_username}</h1>

        <p className="text-xl capitalize h-6">{fullname}</p>

        {profileId === username && (
          <div className="flex gap-4 mt-2">
            <Link className="btn-light rounded-md" to="/settings/edit-profile">
              Edit Profile
            </Link>
          </div>
        )}

        <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />

      </div>

    </section>
  );
};

export default ProfilePage;
