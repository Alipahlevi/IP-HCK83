const axios = require('axios');

const getUser = async (accessToken) => {
  try {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch Discord user data');
  }
};

module.exports = {
  getUser,
};