module.exports = {
  apps: [
    {
      name: "shivguru-hrm-backend",
      script: "dist/index.js", // build ke baad jo entry point hai
      env: {
        NODE_ENV: "production",
        MONGO_URI: "mongodb://127.0.0.1:27017/ShivGuruHrm", //"mongodb://127.0.0.1:27017/yourdbname"
        PORT: "4000",
        JWT_SECRET: "Staff150HRM",
        // ya atlas ka URI agar cloud use kar rahe ho
      },
    },
  ],
};
