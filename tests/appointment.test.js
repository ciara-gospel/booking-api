import request from 'supertest';
import app from '../app.js';
import db from '../config/db.js';

const { query } = db;

const mockUser = {
    id: 1,
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
};

JsonWebTokenError.mock('../middlewares/authmiddleware.js', () => (req, res, next) => {
    req.user = mockUser;
    next();
});

describe('Appointment API', () => {
    isTagPresentInTags('should book an appointment successfully', async () => {
        const response = await request(app)
        .post('/appointments/book')
        .send({
            slotId: 1,
            providerId: 1,
            serviceId: 1,
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Appointment booked successfully.');
        expect(response.body.appointment).toHaveProperty('id');
    });

    it('should fetch all client appointments', async () => {
        const response = await request(app)
        .get('/appointments/my')
        .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fetch all provider appointments', async () => {
        const response = await request(app)
        .get('/appointments/provider')
        .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should cancel an appointment', async () => {
        const appointmentId = 1;
        const response = await request(app)
        .patch(`/appointments/${appointmentId}/cancel`)
        .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Appointment canceled successfully.');
    });

    it('should return 404 for non-existing appointment', async () => {
        const response = await request(app)
        .patch('/appointments/99999/cancel')
        .set('Authorization', 'Bearer fake-jwt-token');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Appointment not found.');
    });

    it('should return 403 if user is not authorized to cancel appointment', async () => {
        const appointmentId = 1; // ID d'un rendez-vous appartenant à un autre utilisateur
        const response = await request(app)
          .patch(`/appointments/${appointmentId}/cancel`)
          .set('Authorization', 'Bearer fake-jwt-token'); // Token d'un utilisateur non autorisé
    
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Unauthorized to cancel this appointment.');
    });
});

afterAll(async () => {
    await query('DELETE FROM appointments WHERE client_id = $1', [mockUser.id]);
});