/**
 * AeroShield AI - Community Clean-Air Defense Grid Service
 * Orchestrates neighborhood-level syndicates, carpooling pools, collective buying, and shared clean air hubs.
 */

class CommunityService {
  constructor() {
    this.syndicates = [
      {
        id: 'carpool-syndicate-north',
        name: 'Sector 14 to Cyber Hub Commute Syndicate',
        type: 'CARPOOL',
        activeMembers: 18,
        carsTakenOffRoadDaily: 14,
        dailyCO2AvoidedKg: 44.8,
        dailyPM25AvoidedGrams: 196,
        route: 'Sector 14 -> MG Road -> Cyber Hub',
        departureWindow: '08:15 AM - 08:30 AM',
        organizer: 'Sunita M. (Parent & Clean-Air Champion)'
      },
      {
        id: 'school-idle-free-zone',
        name: 'St. Mary High School Idle-Free Drop-off Zone',
        type: 'SCHOOL_DEFENSE',
        activeMembers: 64,
        carsPledged: 52,
        dailyCO2AvoidedKg: 28.5,
        dailyPM25AvoidedGrams: 145,
        targetZone: 'North Gate & Main Bus Terminal',
        status: 'Active (Enforced by Parent Volunteers)',
        organizer: 'Parents for Clean Lungs'
      },
      {
        id: 'shared-purifier-library',
        name: 'AeroShield Community Purifier Lending Library',
        type: 'EQUIPMENT_SHARING',
        activeUnits: 8,
        unitsCurrentlyLoaned: 7,
        beneficiaries: ['Newborn Nursery', 'Asthma Senior Resident', 'Ground Floor Clinic'],
        availableUnits: 1,
        organizer: 'Resident Welfare Association (RWA)'
      },
      {
        id: 'zero-burning-compost-depot',
        name: 'Green-Leaves Community Mulching & Aerobic Compost Depot',
        type: 'WASTE_TRANSITION',
        activeMembers: 42,
        leafPilesDivertedFromBurning: 185, // piles diverted this winter
        toxicSmokeAvertedKg: 310,
        organicCompostYieldKg: 950,
        status: 'Operating 2 Shredder Depots',
        organizer: 'Neighborhood Eco Action Committee'
      }
    ];

    this.communityPledges = [
      { id: 1, text: 'No wood or garden leaf burning on my premises', count: 142 },
      { id: 2, text: 'Keep car AC on internal recirculation during commutes', count: 215 },
      { id: 3, text: 'Turn off car engine when idling for >30 seconds', count: 189 },
      { id: 4, text: 'Air out home strictly during the 13:00-15:00 Inversion Golden Window', count: 278 },
      { id: 5, text: 'Built a DIY Corsi-Rosenthal Box for family / shared with neighbor', count: 87 }
    ];
  }

  getGridStatus() {
    const totalMembers = this.syndicates.reduce((acc, s) => acc + s.activeMembers, 0);
    const totalCO2KgDaily = this.syndicates.reduce((acc, s) => acc + (s.dailyCO2AvoidedKg || 0), 0);
    const totalPM25GramsDaily = this.syndicates.reduce((acc, s) => acc + (s.dailyPM25AvoidedGrams || 0), 0);
    const totalPledges = this.communityPledges.reduce((acc, p) => acc + p.count, 0);

    return {
      activeSyndicatesCount: this.syndicates.length,
      totalEngagedResidents: totalMembers + totalPledges,
      dailyCommunityImpact: {
        totalCO2AvoidedKg: Number(totalCO2KgDaily.toFixed(1)),
        totalPM25AvoidedGrams: Number(totalPM25GramsDaily.toFixed(1)),
        carsEliminatedDaily: 14 + 52,
        treesEquivalentAnnualCleanAir: Math.round(totalCO2KgDaily * 365 / 22) // 1 tree absorbs ~22kg CO2/yr
      },
      syndicates: this.syndicates,
      pledges: this.communityPledges
    };
  }

  joinSyndicate(syndicateId, userDetails) {
    const syn = this.syndicates.find(s => s.id === syndicateId);
    if (!syn) return { success: false, message: 'Syndicate not found' };

    syn.activeMembers += 1;
    if (syn.dailyCO2AvoidedKg) syn.dailyCO2AvoidedKg += 2.8;
    if (syn.dailyPM25AvoidedGrams) syn.dailyPM25AvoidedGrams += 12;

    return {
      success: true,
      message: `Successfully joined "${syn.name}"! You are connected with ${syn.activeMembers} neighbors.`,
      syndicate: syn
    };
  }

  signPledge(pledgeId) {
    const pledge = this.communityPledges.find(p => p.id === pledgeId);
    if (!pledge) return { success: false, message: 'Pledge not found' };

    pledge.count += 1;
    return {
      success: true,
      message: `Thank you for taking the pledge: "${pledge.text}"!`,
      pledge
    };
  }
}

module.exports = new CommunityService();
