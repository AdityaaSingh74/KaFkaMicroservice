package com.utkarshhh.consumer;

import com.utkarshhh.config.RabbitMQConfig;
import com.utkarshhh.dto.BookingNotificationDTO;
import com.utkarshhh.dto.PaymentNotificationDTO;
import com.utkarshhh.service.EmailService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private final EmailService emailService;

    @Autowired
    public NotificationConsumer(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = RabbitMQConfig.BOOKING_QUEUE)
    public void handleBookingNotification(BookingNotificationDTO notification) {
        System.out.println("   Received BOOKING notification:");
        System.out.println("   Booking ID: " + notification.getBookingId());
        System.out.println("   Customer: " + notification.getCustomerName());
        System.out.println("   Email: " + notification.getCustomerEmail());

        try {
            emailService.sendBookingConfirmation(
                    notification.getCustomerEmail(),
                    notification.getCustomerName(),
                    notification.getSalonName(),
                    notification.getServiceName(),
                    notification.getStartTime(),
                    notification.getTotalPrice()
            );

            System.out.println("Booking confirmation email sent!");
        } catch (Exception e) {
            System.err.println("Failed to send booking email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_QUEUE)
    public void handlePaymentNotification(PaymentNotificationDTO notification) {
        System.out.println("Received PAYMENT notification:");
        System.out.println("   Payment ID: " + notification.getPaymentId());
        System.out.println("   Customer: " + notification.getCustomerName());
        System.out.println("   Email: " + notification.getCustomerEmail());
        System.out.println("   Amount: ₹" + notification.getAmount());

        try {
            emailService.sendPaymentReceipt(
                    notification.getCustomerEmail(),
                    notification.getCustomerName(),
                    notification.getAmount(),
                    notification.getTransactionId()
            );

            System.out.println("Payment receipt email sent!");
        } catch (Exception e) {
            System.err.println("Failed to send payment email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}