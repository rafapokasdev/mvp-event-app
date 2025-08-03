import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useEventsStore from '../store/eventsStore';
import { Ticket } from '../types/events';

// Componente para gerar QR Code visual simples
const QRCodeView = ({ value }: { value: string }) => {
  return (
    <View style={styles.qrCodeContainer}>
      <View style={styles.qrCode}>
        <Text style={styles.qrCodeText}>QR</Text>
        <Text style={styles.qrCodeValue}>{value}</Text>
      </View>
    </View>
  );
};

export default function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const router = useRouter();
  const { getUserTickets, getUserPurchases } = useEventsStore();
  
  const userTickets = getUserTickets();
  const userPurchases = getUserPurchases();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'used': return '#6b7280';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'used': return 'Utilizado';
      case 'expired': return 'Expirado';
      default: return 'Desconhecido';
    }
  };

  const showQRCode = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const shareTicket = (ticket: Ticket) => {
    Alert.alert(
      'Compartilhar Ingresso',
      `Ingresso: ${ticket.event.title}\nCódigo: ${ticket.qrCode}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Ingressos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="ticket" size={24} color="#6366f1" />
          <Text style={styles.summaryNumber}>{userTickets.length}</Text>
          <Text style={styles.summaryLabel}>Total de Ingressos</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text style={styles.summaryNumber}>
            {userTickets.filter(t => t.status === 'active').length}
          </Text>
          <Text style={styles.summaryLabel}>Ativos</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="card" size={24} color="#f59e0b" />
          <Text style={styles.summaryNumber}>{userPurchases.length}</Text>
          <Text style={styles.summaryLabel}>Compras</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {userTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nenhum ingresso encontrado</Text>
            <Text style={styles.emptyDescription}>
              Compre seu primeiro ingresso para começar!
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/home')}
            >
              <Text style={styles.exploreButtonText}>Explorar Eventos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Ingressos Ativos</Text>
            
            {userTickets.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{ticket.event.title}</Text>
                    <Text style={styles.eventLocation}>{ticket.event.location}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
                  </View>
                </View>

                <View style={styles.ticketDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {formatDate(ticket.event.date)} • {ticket.event.time}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="card-outline" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Comprado em {formatDate(ticket.purchaseDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.ticketActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => showQRCode(ticket)}
                  >
                    <Ionicons name="qr-code" size={20} color="#6366f1" />
                    <Text style={styles.actionButtonText}>Ver QR Code</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => shareTicket(ticket)}
                  >
                    <Ionicons name="share-outline" size={20} color="#6366f1" />
                    <Text style={styles.actionButtonText}>Compartilhar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>QR Code do Ingresso</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedTicket && (
              <>
                <Text style={styles.modalEventTitle}>{selectedTicket.event.title}</Text>
                
                <QRCodeView value={selectedTicket.qrCode} />
                
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketId}>ID: {selectedTicket.id}</Text>
                  <Text style={styles.ticketCode}>Código: {selectedTicket.qrCode}</Text>
                </View>

                <Text style={styles.modalInstructions}>
                  Apresente este QR Code na entrada do evento para validação
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  ticketDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  actionButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrCodeContainer: {
    marginVertical: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#6366f1',
  },
  qrCodeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  qrCodeValue: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 4,
  },
  ticketInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  ticketId: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  ticketCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  modalInstructions: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});