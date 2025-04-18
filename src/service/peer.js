class PeerService {
  constructor() {
    this.createPeer();
  }

  createPeer() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    });
  }

  async getAnswer(offer) {
    if (this.peer.signalingState === "closed") {
      this.createPeer();
    }

    await this.peer.setRemoteDescription(offer);
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(ans);
    return ans;
  }

  async setLocalDescription(ans) {
    if (this.peer.signalingState === "closed") {
      this.createPeer();
    }
    await this.peer.setRemoteDescription(ans);
  }

  async getOffer() {
    if (this.peer.signalingState === "closed") {
      this.createPeer();
    }
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  close() {
    if (this.peer) {
      this.peer.close();
    }
  }
}

export default new PeerService();
