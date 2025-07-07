// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const nodemailer = require('nodemailer');
// const User = require("./models/user");
// const clientrequestform = require("./models/clientsiderequestform");
// const Project = require("./models/project");
// const Progress = require("./models/progress");
// const Material = require("./models/material");
// const Labor = require("./models/labor");


// const app = express();
// app.use(cors());
// app.use(express.json());

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Use Gmail or another service
//   auth: {
//     user: 'petchipandi05@gmail.com', // Contractor email
//     pass: 'ljir wahv zfkt drqy', // Use an app-specific password if 2FA is enabled
//   },
// });

// cloudinary.config({
//   cloud_name: "dd30lpyet",
//   api_key: "395465717975918",
//   api_secret: "dFZA1ZymZrAiIfs9-o-nnk_zFjs",
// });

// const SECRET_KEY = "myfirstproject";

// // Signup
// app.post("/signup", async (req, res) => {
//   console.log("Signup request received");
//   try {
//     const { name, email, password, phone } = req.body;

//     if (!name || !email || !password || !phone) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, phone, role: 'Client' });
//     await newUser.save();

//     // Generate JWT token
//     const token = jwt.sign({ id: newUser._id, role: newUser.role }, SECRET_KEY);

//     // Return token and user data
//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//       user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role },
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   console.log("Login request received");
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found");
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Incorrect password");
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Determine role based on email
//     let role = user.role; // Default to role from database
//     if (email === "admin123@gmail.com" && password === "admin123") {
//       role = "Admin"; // Override role for admin credentials
//     } else {
//       role = "Client"; // Default role for other users
//     }

//     const token = jwt.sign({ id: user._id, role }, SECRET_KEY,);

//     res.json({
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         email: user.email, 
//         phone: user.phone, 
//         role // Include the determined role
//       },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Client Request Form Submission
// app.post('/clientrequestform', async (req, res) => {
//   try {
//     const projectData = req.body;
//     const newProject = new clientrequestform(projectData);
//     await newProject.save();
//     res.status(201).json({ message: 'Project submitted successfully', project: newProject });
//   } catch (error) {
//     console.error('Error submitting project:', error);
//     res.status(400).json({ message: 'Error submitting project', error: error.message });
//   }
// });

// // Get All Client Requests
// app.get('/registrations', async (req, res) => {
//   try {
//     const projects = await clientrequestform.find().sort({ createdAt: -1 });
//     res.status(200).json(projects);
//   } catch (error) {
//     console.error('Error fetching projects:', error);
//     res.status(500).json({ message: 'Error fetching projects', error: error.message });
//   }
// });

// // Verify Client Request
// app.patch('/registrations/:id/verify', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const project = await clientrequestform.findByIdAndUpdate(
//       id,
//       { verified: true },
//       { new: true, runValidators: true }
//     );

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.status(200).json({ message: 'Project marked as verified', project });
//   } catch (error) {
//     console.error('Error verifying project:', error);
//     res.status(500).json({ message: 'Error verifying project', error: error.message });
//   }
// });

// // Create a New Project with Image Upload
// app.post('/projects', upload.single('projectImage'), async (req, res) => {
//   try {
//     const {
//       projectName,
//       location,
//       cost,
//       startingDate,
//       deadline,
//       totalLandArea,
//       typeOfConstruction,
//       divisions,
//       email,
//     } = req.body;

//     const client = await User.findOne({ email });
//     if (!client) {
//       return res.status(404).json({ message: 'Client not found with this email' });
//     }

//     let imageUrl = null;
//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           { folder: 'projects' },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         uploadStream.end(req.file.buffer);
//       });
//       imageUrl = result.secure_url;
//     }

//     const newProject = new Project({
//       projectName,
//       location,
//       cost,
//       startingDate,
//       deadline,
//       totalLandArea,
//       typeOfConstruction,
//       divisions: JSON.parse(divisions),
//       clientId: client._id,
//       imageUrl,
//     });

//     const savedProject = await newProject.save();

//     client.projects.push(savedProject._id);
//     await client.save();

//     res.status(201).json({ message: 'Project created successfully', project: savedProject });
//   } catch (error) {
//     console.error('Error creating project:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get All Projects
// app.get('/projects', async (req, res) => {
//   try {
//     const projects = await Project.find()
//       .populate('clientId', 'name email phone')
//       .sort({ createdAt: -1 });
//     res.status(200).json(projects);
//   } catch (error) {
//     console.error('Error fetching projects:', error);
//     res.status(500).json({ message: 'Error fetching projects', error: error.message });
//   }
// });

// // Update Project Status
// app.patch('/projects/:id/status', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const project = await Project.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.status(200).json({ message: 'Project status updated', project });
//   } catch (error) {
//     console.error('Error updating project status:', error);
//     res.status(500).json({ message: 'Error updating project status', error: error.message });
//   }
// });

// // Update a Project
// app.patch('/projects/:id', upload.single('projectImage'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { projectName, location, cost, startingDate, deadline, totalLandArea, typeOfConstruction, divisions, email } = req.body;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const client = await User.findOne({ email });
//     if (!client) return res.status(404).json({ message: 'Client not found with this email' });

//     project.projectName = projectName || project.projectName;
//     project.location = location || project.location;
//     project.cost = cost || project.cost;
//     project.startingDate = startingDate || project.startingDate;
//     project.deadline = deadline || project.deadline;
//     project.totalLandArea = totalLandArea || project.totalLandArea;
//     project.typeOfConstruction = typeOfConstruction || project.typeOfConstruction;
//     project.divisions = divisions ? JSON.parse(divisions) : project.divisions;
//     project.clientId = client._id;

//     if (req.file) {
//       if (project.imageUrl) {
//         const publicId = project.imageUrl.split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(`projects/${publicId}`);
//       }
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           { folder: 'projects' },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         uploadStream.end(req.file.buffer);
//       });
//       project.imageUrl = result.secure_url;
//     }

//     const updatedProject = await project.save();
//     res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
//   } catch (error) {
//     console.error('Error updating project:', error);
//     res.status(500).json({ message: 'Error updating project', error: error.message });
//   }
// });

// // Delete a Project
// app.delete('/projects/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const project = await Project.findByIdAndDelete(id);
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     if (project.imageUrl) {
//       const publicId = project.imageUrl.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(`projects/${publicId}`);
//     }

//     await User.updateOne(
//       { _id: project.clientId },
//       { $pull: { projects: id } }
//     );

//     await Labor.deleteMany({ projectId: id });
//     await Material.deleteMany({ projectId: id });

//     res.status(200).json({ message: 'Project deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting project:', error);
//     res.status(500).json({ message: 'Error deleting project', error: error.message });
//   }
// });

// // Get Project Metrics
// app.get('/project-metrics', async (req, res) => {
//   try {
//     const ongoingProjects = await Project.countDocuments({ status: 'ongoing' });
//     const completedProjects = await Project.countDocuments({ status: 'finished' });
//     const totalProjects = await Project.countDocuments();

//     const metrics = {
//       ongoingProjects,
//       completedProjects,
//       totalProjects,
//     };

//     res.status(200).json(metrics);
//   } catch (error) {
//     console.error('Error fetching project metrics:', error);
//     res.status(500).json({ message: 'Error fetching project metrics', error: error.message });
//   }
// });

// // Get Project Details by ID
// app.get('/projects/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const project = await Project.findById(id).populate('clientId', 'name email phone');
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.status(200).json({
//       project: {
//         id: project._id,
//         name: project.projectName,
//         location: project.location,
//         startDate: project.startingDate,
//         deadline: project.deadline,
//         projectType: project.typeOfConstruction,
//         status: project.status,
//         projectCost: project.cost,
//         divisions: project.divisions,
//         totalLandArea: project.totalLandArea,
//         imageUrl: project.imageUrl,
//         totalLaborCost: project.totalLaborCost,
//         totalMaterialCost: project.totalMaterialCost,
//         grandProjectCost: project.grandProjectCost,
//         user: {
//           name: project.clientId.name,
//           email: project.clientId.email,
//           phone: project.clientId.phone,
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching project details:', error);
//     res.status(500).json({ message: 'Error fetching project details', error: error.message });
//   }
// });

// // Create Progress (Modified to include email notification)
// app.post('/projects/:id/progress', upload.array('media', 10), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { division, progress, description } = req.body;

//     if (!division || !progress || !description) {
//       return res.status(400).json({ message: 'Division, progress, and description are required' });
//     }

//     const project = await Project.findById(id).populate('clientId', 'email name');
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     if (!project.clientId || !project.clientId.email) {
//       return res.status(400).json({ message: 'Client email not found' });
//     }

//     const mediaUploads = req.files && req.files.length > 0 ? await Promise.all(
//       req.files.map(file =>
//         new Promise((resolve, reject) => {
//           const uploadStream = cloudinary.uploader.upload_stream(
//             {
//               folder: 'progress',
//               resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
//             },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve({
//                 url: result.secure_url,
//                 type: file.mimetype.startsWith('video/') ? 'video' : 'image',
//               });
//             }
//           );
//           uploadStream.end(file.buffer);
//         })
//       )
//     ) : [];

//     const progressUpdate = new Progress({
//       projectId: id,
//       division,
//       progress: parseInt(progress), // Ensure progress is a number
//       media: mediaUploads,
//       description,
//     });

//     await progressUpdate.save();
//     project.progressUpdates.push(progressUpdate._id);
//     await project.save();

//     const mailOptions = {
//       from: 'petchipandi05@gmial.com',
//       to: project.clientId.email,
//       subject: 'New Progress Update for Your Project',
//       text: `Dear ${project.clientId.name || 'Client'},\n\nA new progress update has been posted for your project "${project.projectName}" by the contractor. Division: ${division}, Progress: ${progress}%, Description: ${description}.\n\nPlease log in to view the details.\n\nBest,\nThe BuildTrue Team`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json(progressUpdate);
//   } catch (error) {
//     console.error('Error creating progress:', error.stack); // More detailed error
//     res.status(500).json({ message: 'Error creating progress', error: error.message });
//   }
// });
// // Get All Progress Updates for a Project
// app.get('/projects/:id/progress', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const progressUpdates = await Progress.find({ projectId: id }).sort({ dateUpdated: -1 });
//     res.status(200).json(progressUpdates);
//   } catch (error) {
//     console.error('Error fetching progress updates:', error);
//     res.status(500).json({ message: 'Error fetching progress updates', error: error.message });
//   }
// });

// // Update Progress
// app.put('/projects/:id/progress/:progressId', upload.array('media', 10), async (req, res) => {
//   try {
//     const { id, progressId } = req.params;
//     const { division, progress, description } = req.body;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const progressUpdate = await Progress.findById(progressId);
//     if (!progressUpdate || progressUpdate.projectId.toString() !== id) {
//       return res.status(404).json({ message: 'Progress update not found' });
//     }

//     // Delete old media from Cloudinary if new files are uploaded
//     if (req.files.length > 0 && progressUpdate.media.length > 0) {
//       await Promise.all(
//         progressUpdate.media.map(media => {
//           const publicId = media.url.split('/').pop().split('.')[0];
//           const resourceType = media.type === 'video' ? 'video' : 'image';
//           return cloudinary.uploader.destroy(`progress/${publicId}`, { resource_type: resourceType });
//         })
//       );
//     }

//     const mediaUploads = req.files.length > 0 ? await Promise.all(
//       req.files.map(file =>
//         new Promise((resolve, reject) => {
//           const uploadStream = cloudinary.uploader.upload_stream(
//             {
//               folder: 'progress',
//               resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
//             },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve({
//                 url: result.secure_url,
//                 type: file.mimetype.startsWith('video/') ? 'video' : 'image',
//               });
//             }
//           );
//           uploadStream.end(file.buffer);
//         })
//       )
//     ) : progressUpdate.media;

//     progressUpdate.division = division || progressUpdate.division;
//     progressUpdate.progress = progress || progressUpdate.progress;
//     progressUpdate.media = mediaUploads;
//     progressUpdate.description = description || progressUpdate.description;
//     progressUpdate.dateUpdated = Date.now();

//     await progressUpdate.save();
//     res.status(200).json(progressUpdate);
//   } catch (error) {
//     console.error('Error updating progress:', error);
//     res.status(500).json({ message: 'Error updating progress', error: error.message });
//   }
// });

// // Delete Progress
// app.delete('/projects/:id/progress/:progressId', async (req, res) => {
//   try {
//     const { id, progressId } = req.params;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const progressUpdate = await Progress.findById(progressId);
//     if (!progressUpdate || progressUpdate.projectId.toString() !== id) {
//       return res.status(404).json({ message: 'Progress update not found' });
//     }

//     if (progressUpdate.media.length > 0) {
//       await Promise.all(
//         progressUpdate.media.map(media => {
//           const publicId = media.url.split('/').pop().split('.')[0];
//           const resourceType = media.type === 'video' ? 'video' : 'image';
//           return cloudinary.uploader.destroy(`progress/${publicId}`, { resource_type: resourceType });
//         })
//       );
//     }

//     await Progress.deleteOne({ _id: progressId });
//     project.progressUpdates = project.progressUpdates.filter(p => p.toString() !== progressId);
//     await project.save();

//     res.status(200).json({ message: 'Progress update deleted' });
//   } catch (error) {
//     console.error('Error deleting progress:', error);
//     res.status(500).json({ message: 'Error deleting progress', error: error.message });
//   }
// });

// // Get Specific Progress Update by ID
// app.get('/progress/:progressId', async (req, res) => {
//   try {
//     const { progressId } = req.params;
//     const progress = await Progress.findById(progressId);
//     if (!progress) return res.status(404).json({ message: 'Progress update not found' });
//     res.status(200).json(progress);
//   } catch (error) {
//     console.error('Error fetching progress details:', error);
//     res.status(500).json({ message: 'Error fetching progress details', error: error.message });
//   }
// });

// // Get All Materials for a Project
// app.get('/projects/:id/materials', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const materials = await Material.find({ projectId: id }).sort({ createdAt: -1 });
//     const project = await Project.findById(id);
//     res.status(200).json({
//       materials,
//       totalMaterialCost: project.totalMaterialCost,
//       totalLaborCost: project.totalLaborCost,
//       grandProjectCost: project.grandProjectCost,
//     });
//   } catch (error) {
//     console.error('Error fetching materials:', error);
//     res.status(500).json({ message: 'Error fetching materials', error: error.message });
//   }
// });

// // Create or Update Material Usage
// app.post('/projects/:id/materials/usage', async (req, res) => {
//   try {
//     const { id } = req.params; // projectId
//     const { materialName, division, quantity, unit, description, date, usageId } = req.body;

//     let material = await Material.findOne({ projectId: id, name: materialName });
//     if (!material) {
//       material = new Material({ projectId: id, name: materialName, usageInfo: [], purchaseInfo: [] });
//     }

//     if (usageId) {
//       const usageIndex = material.usageInfo.findIndex(u => u._id.toString() === usageId);
//       if (usageIndex !== -1) {
//         material.usageInfo[usageIndex] = { division, quantity, unit, description, date };
//       }
//     } else {
//       material.usageInfo.push({ division, quantity, unit, description, date });
//     }

//     await material.save();
//     res.status(200).json(material);
//   } catch (error) {
//     console.error('Error adding/updating material usage:', error);
//     res.status(500).json({ message: 'Error adding/updating material usage', error: error.message });
//   }
// });

// // Create or Update Material Purchase
// app.post('/projects/:id/materials/purchase', async (req, res) => {
//   try {
//     const { id } = req.params; // projectId
//     const { materialName, date, quantity, supplier, unitPrice, totalCost, deliveryNote, invoiceNumber, purchaseId } = req.body;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     let material = await Material.findOne({ projectId: id, name: materialName });
//     let oldTotalCost = 0;

//     if (purchaseId) {
//       const existingMaterial = await Material.findOne({ projectId: id, 'purchaseInfo._id': purchaseId });
//       if (!existingMaterial) {
//         return res.status(404).json({ message: 'Purchase entry not found' });
//       }
//       const purchaseIndex = existingMaterial.purchaseInfo.findIndex(p => p._id.toString() === purchaseId);
//       oldTotalCost = existingMaterial.purchaseInfo[purchaseIndex].totalCost;

//       if (material) {
//         material.purchaseInfo[purchaseIndex] = { date, quantity, supplier, unitPrice, totalCost, deliveryNote, invoiceNumber };
//       }
//     } else {
//       if (!material) {
//         material = new Material({ projectId: id, name: materialName, usageInfo: [], purchaseInfo: [] });
//         project.materials.push(material._id);
//       }
//       material.purchaseInfo.push({ date, quantity, supplier, unitPrice, totalCost, deliveryNote, invoiceNumber });
//     }

//     await material.save();

//     project.totalMaterialCost = project.totalMaterialCost - oldTotalCost + totalCost;
//     project.grandProjectCost = project.totalLaborCost + project.totalMaterialCost;
//     await project.save();

//     res.status(200).json(material);
//   } catch (error) {
//     console.error('Error adding/updating material purchase:', error);
//     res.status(500).json({ message: 'Error adding/updating material purchase', error: error.message });
//   }
// });

// // Delete Material Usage
// app.delete('/projects/:id/materials/usage/:usageId', async (req, res) => {
//   try {
//     const { id, usageId } = req.params;
//     const material = await Material.findOne({ projectId: id, 'usageInfo._id': usageId });
//     if (!material) {
//       return res.status(404).json({ message: 'Material or usage entry not found' });
//     }

//     material.usageInfo = material.usageInfo.filter(u => u._id.toString() !== usageId);
//     await material.save();
//     res.status(200).json(material);
//   } catch (error) {
//     console.error('Error deleting material usage:', error);
//     res.status(500).json({ message: 'Error deleting material usage', error: error.message });
//   }
// });

// // Delete Material Purchase
// app.delete('/projects/:id/materials/purchase/:purchaseId', async (req, res) => {
//   try {
//     const { id, purchaseId } = req.params;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const material = await Material.findOne({ projectId: id, 'purchaseInfo._id': purchaseId });
//     if (!material) {
//       return res.status(404).json({ message: 'Material or purchase entry not found' });
//     }

//     const purchaseToDelete = material.purchaseInfo.find(p => p._id.toString() === purchaseId);
//     const deletedTotalCost = purchaseToDelete.totalCost;

//     material.purchaseInfo = material.purchaseInfo.filter(p => p._id.toString() !== purchaseId);
//     await material.save();

//     project.totalMaterialCost -= deletedTotalCost;
//     project.grandProjectCost = project.totalLaborCost + project.totalMaterialCost;
//     await project.save();

//     res.status(200).json(material);
//   } catch (error) {
//     console.error('Error deleting material purchase:', error);
//     res.status(500).json({ message: 'Error deleting material purchase', error: error.message });
//   }
// });

// // Get All Labor Records for a Project
// app.get('/projects/:id/labor', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const laborRecords = await Labor.find({ projectId: id }).sort({ date: -1 });
//     const project = await Project.findById(id);

//     res.status(200).json({
//       laborRecords,
//       totalLaborCost: project.totalLaborCost,
//       totalMaterialCost: project.totalMaterialCost,
//       grandProjectCost: project.grandProjectCost,
//     });
//   } catch (error) {
//     console.error('Error fetching labor records:', error);
//     res.status(500).json({ message: 'Error fetching labor records', error: error.message });
//   }
// });

// // Create a New Labor Record
// app.post('/projects/:id/labor', async (req, res) => {
//   try {
//     const { id } = req.params; // projectId
//     const { laborType, numberOfWorkers, date, rate, description } = req.body;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const totalWage = rate * numberOfWorkers;
//     const newLaborRecord = new Labor({
//       projectId: id,
//       laborType,
//       numberOfWorkers,
//       date,
//       rate,
//       description,
//       totalWage,
//     });

//     const savedLaborRecord = await newLaborRecord.save();

//     project.laborRecords.push(savedLaborRecord._id);
//     project.totalLaborCost += totalWage;
//     project.grandProjectCost = project.totalLaborCost + project.totalMaterialCost;
//     await project.save();

//     res.status(201).json({ message: 'Labor record created successfully', labor: savedLaborRecord });
//   } catch (error) {
//     console.error('Error creating labor record:', error);
//     res.status(500).json({ message: 'Error creating labor record', error: error.message });
//   }
// });

// // Update a Labor Record
// app.put('/projects/:id/labor/:laborId', async (req, res) => {
//   try {
//     const { id, laborId } = req.params;
//     const { laborType, numberOfWorkers, date, rate, description } = req.body;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const laborRecord = await Labor.findById(laborId);
//     if (!laborRecord || laborRecord.projectId.toString() !== id) {
//       return res.status(404).json({ message: 'Labor record not found' });
//     }

//     const oldTotalWage = laborRecord.totalWage;
//     const newTotalWage = rate * numberOfWorkers;

//     laborRecord.laborType = laborType || laborRecord.laborType;
//     laborRecord.numberOfWorkers = numberOfWorkers || laborRecord.numberOfWorkers;
//     laborRecord.date = date || laborRecord.date;
//     laborRecord.rate = rate || laborRecord.rate;
//     laborRecord.description = description || laborRecord.description;
//     laborRecord.totalWage = newTotalWage;

//     const updatedLaborRecord = await laborRecord.save();

//     project.totalLaborCost = project.totalLaborCost - oldTotalWage + newTotalWage;
//     project.grandProjectCost = project.totalLaborCost + project.totalMaterialCost;
//     await project.save();

//     res.status(200).json({ message: 'Labor record updated successfully', labor: updatedLaborRecord });
//   } catch (error) {
//     console.error('Error updating labor record:', error);
//     res.status(500).json({ message: 'Error updating labor record', error: error.message });
//   }
// });

// // Delete a Labor Record
// app.delete('/projects/:id/labor/:laborId', async (req, res) => {
//   try {
//     const { id, laborId } = req.params;

//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const laborRecord = await Labor.findById(laborId);
//     if (!laborRecord || laborRecord.projectId.toString() !== id) {
//       return res.status(404).json({ message: 'Labor record not found' });
//     }

//     const deletedTotalWage = laborRecord.totalWage;

//     await Labor.deleteOne({ _id: laborId });

//     project.laborRecords.pull(laborId);
//     project.totalLaborCost -= deletedTotalWage;
//     project.grandProjectCost = project.totalLaborCost + project.totalMaterialCost;
//     await project.save();

//     res.status(200).json({ message: 'Labor record deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting labor record:', error);
//     res.status(500).json({ message: 'Error deleting labor record', error: error.message });
//   }
// });

// // ... (other imports and setup remain unchanged)
// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user; // { id, role }
//     next();
//   });
// };


// // Get all projects for a client
// app.get('/client/projects', authenticateToken, async (req, res) => {
//   try {
//     const { clientId } = req.query;
//     if (!clientId) return res.status(400).json({ message: 'Client ID required' });

//     if (req.user.id !== clientId) {
//       return res.status(403).json({ message: 'Unauthorized access' });
//     }

//     const projects = await Project.find({ clientId })
//       .populate({
//         path: 'progressUpdates',
//         select: 'progress viewed',
//       }); // Removed limit: 1 to get all progress updates

//     // Calculate unviewed count for each project
//     const projectsWithUnviewed = projects.map(project => ({
//       ...project.toObject(),
//       unviewedCount: project.progressUpdates.filter(p => !p.viewed).length,
//     }));

//     // Total unviewed count across all projects
//     const totalUnviewed = projectsWithUnviewed.reduce((sum, project) => sum + project.unviewedCount, 0);

//     res.status(200).json({ projects: projectsWithUnviewed, totalUnviewed });
//   } catch (error) {
//     console.error('Error fetching client projects:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Add Message to Progress Update
// app.post('/progress/:progressId/messages', authenticateToken, async (req, res) => {
//   try {
//     const { progressId } = req.params;
//     const { text } = req.body; // Only accept text, derive sender from token

//     const progress = await Progress.findById(progressId);
//     if (!progress) {
//       return res.status(404).json({ message: 'Progress update not found' });
//     }

//     const newMessage = {
//       senderId: req.user.id, // Use the authenticated user's ID from the token
//       sender: { text: req.user.role }, // Use the authenticated user's role from the token
//       text,
//       timestamp: new Date(),
//     };

//     progress.messages.push(newMessage);
//     await progress.save();

//     res.status(200).json(progress);
//   } catch (error) {
//     console.error('Error adding message:', error);
//     res.status(500).json({ message: 'Error adding message', error: error.message });
//   }
// });

// // Get all progress updates for a project
// app.get('/projects/:id/progress', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const project = await Project.findById(id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });

//     const progressUpdates = await Progress.find({ projectId: id }).sort({ dateUpdated: -1 });
//     // Calculate unviewed count for the client
//     const unviewedCount = progressUpdates.filter(p => !p.viewed && req.user.role === 'Client').length;
//     res.status(200).json({ progressUpdates, unviewedCount });
//   } catch (error) {
//     console.error('Error fetching progress updates:', error);
//     res.status(500).json({ message: 'Error fetching progress updates', error: error.message });
//   }
// });

// // Get specific progress update by ID
// app.get('/progress/:progressId', authenticateToken, async (req, res) => {
//   try {
//     const { progressId } = req.params;
//     const progress = await Progress.findById(progressId);
//     if (!progress) return res.status(404).json({ message: 'Progress update not found' });
//     res.status(200).json(progress);
//   } catch (error) {
//     console.error('Error fetching progress details:', error);
//     res.status(500).json({ message: 'Error fetching progress details', error: error.message });
//   }
// });
// // Mark progress as viewed
// app.post('/progress/:progressId/view', authenticateToken, async (req, res) => {
//   try {
//     const { progressId } = req.params;
//     const progress = await Progress.findById(progressId);
//     if (!progress) return res.status(404).json({ message: 'Progress update not found' });

//     if (req.user.role === 'Client' && !progress.viewed) {
//       progress.viewed = true;
//       await progress.save();
//     }

//     res.status(200).json({ message: 'Progress marked as viewed', progress });
//   } catch (error) {
//     console.error('Error marking progress as viewed:', error);
//     res.status(500).json({ message: 'Error marking progress as viewed', error: error.message });
//   }
// });

// // Trigger Email Notification
// app.post('/projects/:id/progress/:progressId/notify', async (req, res) => {
//   try {
//     const { id, progressId } = req.params;
//     const project = await Project.findById(id).populate('clientId', 'email name');
//     const progress = await Progress.findById(progressId);

//     if (!project || !progress) return res.status(404).json({ message: 'Project or progress not found' });

//     const mailOptions = {
//       from: 'petchipandi05@gmail.com',
//       to: project.clientId.email,
//       subject: 'New Progress Update for Your Project',
//       text: `Dear ${project.clientId.name},\n\nA new progress update has been posted for your project "${project.projectName}" by the contractor. Division: ${progress.division}, Progress: ${progress.progress}%, Description: ${progress.description}.\n\nPlease log in to view the details.\n\nBest,\nThe BuildTrue Team`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Notification sent successfully' });
//   } catch (error) {
//     console.error('Error sending notification:', error);
//     res.status(500).json({ message: 'Error sending notification', error: error.message });
//   }
// });

// mongoose.connect("mongodb://127.0.0.1/pdlab")
//   .then(() => console.log("Connected to MongoDB successfully"))
//   .catch((err) => console.error("Database connection error:", err));

// app.listen(3001, () => console.log("Server is running on port 3001"));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv')
const authRoutes = require('./routes/auth');
const clientRequestRoutes = require('./routes/clientRequests');
const projectRoutes = require('./routes/projects');
const progressRoutes = require('./routes/progress');
const materialRoutes = require('./routes/materials');
const laborRoutes = require('./routes/labor');

const app = express();

// Middleware
app.use(cors());
dotenv.config();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requestform', clientRequestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/progress', progressRoutes); // Changed from /api/projects to /api/progress
app.use('/api/projectsmaterial', materialRoutes);
app.use('/api/projectslabor', laborRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Database connection error:', err));

// Start Server
app.listen(process.env.PORT, () => console.log('Server is running on port 3001'));