const Certification = require('../models/Certification');

const getAllCertifications = async (req, res) => {
    try {
        const certs = await Certification.find().sort({ order: 1 });
        res.json(certs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
};

const createCertification = async (req, res) => {
    try {
        const { title, credentialUrl, order } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        const cert = await Certification.create({ title, credentialUrl: credentialUrl || '', order: order ?? 0 });
        res.status(201).json(cert);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create certification' });
    }
};

const updateCertification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, credentialUrl, order } = req.body;
        const cert = await Certification.findByIdAndUpdate(id, { title, credentialUrl, order }, { new: true, runValidators: true });
        if (!cert) return res.status(404).json({ error: 'Certification not found' });
        res.json(cert);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update certification' });
    }
};

const deleteCertification = async (req, res) => {
    try {
        const { id } = req.params;
        const cert = await Certification.findByIdAndDelete(id);
        if (!cert) return res.status(404).json({ error: 'Certification not found' });
        res.json({ message: 'Certification deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete certification' });
    }
};

module.exports = { getAllCertifications, createCertification, updateCertification, deleteCertification };
