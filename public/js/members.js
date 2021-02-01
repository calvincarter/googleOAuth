// This file just does a GET request to figure out which user is logged in
// and updates the HTML on the page
const loadUser = async () => {
  const userResponse = await axios.get("/api/user_data");
  $(".member-name").text(userResponse.data.email);
};

loadUser();
