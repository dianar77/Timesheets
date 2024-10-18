const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const createdProject = await newProject.create();
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = new Project({ ...req.body, ProjectID: req.params.id });
    const updatedProject = await project.update();
    if (updatedProject) {
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const result = await Project.delete(req.params.id);
    if (result) {
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

exports.getProjectForDropdown = async (req, res) => {
    try {
      const projects = await Project.findAll({
        attributes: ['ProjectID', 'Name'],
        order: [['Name', 'ASC']]
      });
      
      const formattedprojects = projects.map(d => ({
        id: d.ProjectID,
        name: d.Name
      }));
      
      res.json(formattedprojects);
    } catch (error) {
      console.error('Error fetching projects for dropdown:', error);
      res.status(500).json({ message: 'Error fetching projects for dropdown', error: error.message });
    }
  };

  exports.getProjectByVessel = async (req, res) => {
    try {
      const vesselId = req.params.vesselId;
      const staffs = await Staff.findAll({
        where: { VesselID: vesselId },
        attributes: ['ProjectID', 'Name', 'Num', 'VesselID'] // Add or remove attributes as needed
      });
      res.json(staffs);
    } catch (error) {
      console.error('Error fetching staff by vessel:', error);
      res.status(500).json({ message: 'Error fetching staff by vessel', error: error.message });
    }
  };
