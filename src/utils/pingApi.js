export const pingServer = async () => {
  try {
    const response = await fetch('https://bug116.onrender.com/transactions/ping');
    const data = await response.json();
    console.log(`Ping at ${new Date().toISOString()}: ${data.message}`);
    return data;
  } catch (error) {
    console.error(`Ping failed at ${new Date().toISOString()}:`, error);
    throw error;
  }
};