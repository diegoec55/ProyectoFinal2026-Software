// para validar roles
exports.isAdmin = (req, res, next) => {
    // Nota: req.user debe ser inyectado previamente por tu middleware de verificación de JWT
    if (req.user && req.user.role === 'admin') {
        return next()
    }
    return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de Administrador' })
}

exports.isCarerOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'carer' || req.user.role === 'admin')) {
        return next()
    }
    return res.status(403).json({ message: 'Acceso denegado: No autorizado' })
}