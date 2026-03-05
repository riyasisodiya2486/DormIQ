import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const roomValidation = [
    body('roomNumber').notEmpty().withMessage('Room number is required'),
    validateRequest
];

export const deviceValidation = [
    body('name').notEmpty().withMessage('Device name is required'),
    body('type').notEmpty().withMessage('Device type is required'),
    body('roomNumber').notEmpty().withMessage('Room number is required'),
    body('mode').isIn(['Auto', 'Manual']).withMessage('Mode must be Auto or Manual'),
    body('powerWatts').isNumeric().withMessage('powerWatts must be a number'),
    validateRequest
];

export const automationConfigValidation = [
    body('idleThresholdSeconds').optional().isNumeric(),
    body('sleepModeEnabled').optional().isBoolean(),
    body('automationEnabled').optional().isBoolean(),
    body('nightModeStart').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('nightModeStart must be HH:mm'),
    body('nightModeEnd').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('nightModeEnd must be HH:mm'),
    validateRequest
];
