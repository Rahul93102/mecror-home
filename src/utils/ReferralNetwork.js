/**
 * Mercor Referral Network Challenge Implementation
 * A comprehensive referral network system with advanced analytics
 */

class ReferralNetwork {
  constructor() {
    this.graph = new Map(); // adjacency list: user -> Set of referred users
    this.referrers = new Map(); // candidate -> referrer mapping
    this.users = new Set(); // all users in the network
  }

  /**
   * Part 1: Basic Referral Graph Operations
   */

  // Add a user to the network
  addUser(userId) {
    if (!this.users.has(userId)) {
      this.users.add(userId);
      this.graph.set(userId, new Set());
    }
  }

  // Add a referral link from referrer to candidate
  addReferral(referrer, candidate) {
    // Validation: No self-referrals
    if (referrer === candidate) {
      throw new Error("Self-referrals are not allowed");
    }

    // Validation: Unique referrer - candidate can only have one referrer
    if (this.referrers.has(candidate)) {
      throw new Error(`Candidate ${candidate} already has a referrer`);
    }

    // Add users if they don't exist
    this.addUser(referrer);
    this.addUser(candidate);

    // Check for cycles using DFS
    if (this.wouldCreateCycle(referrer, candidate)) {
      throw new Error("Adding this referral would create a cycle");
    }

    // Add the referral
    this.graph.get(referrer).add(candidate);
    this.referrers.set(candidate, referrer);

    return true;
  }

  // Check if adding a referral would create a cycle
  wouldCreateCycle(referrer, candidate) {
    // If candidate can reach referrer, then adding referrer->candidate would create a cycle
    const visited = new Set();
    return this.canReach(candidate, referrer, visited);
  }

  // DFS to check if source can reach target
  canReach(source, target, visited = new Set()) {
    if (source === target) return true;
    if (visited.has(source)) return false;

    visited.add(source);

    const neighbors = this.graph.get(source) || new Set();
    for (const neighbor of neighbors) {
      if (this.canReach(neighbor, target, visited)) {
        return true;
      }
    }

    return false;
  }

  // Get direct referrals for a user
  getDirectReferrals(userId) {
    return Array.from(this.graph.get(userId) || new Set());
  }

  /**
   * Part 2: Full Network Reach Analysis
   */

  // Calculate total referral count using BFS
  getTotalReferralCount(userId) {
    if (!this.users.has(userId)) return 0;

    const visited = new Set();
    const queue = [userId];
    let count = 0;

    while (queue.length > 0) {
      const current = queue.shift();

      if (visited.has(current)) continue;
      visited.add(current);

      // Don't count the original user
      if (current !== userId) {
        count++;
      }

      const referrals = this.graph.get(current) || new Set();
      for (const referral of referrals) {
        if (!visited.has(referral)) {
          queue.push(referral);
        }
      }
    }

    return count;
  }

  // Get downstream reach set for a user
  getDownstreamReach(userId) {
    const reached = new Set();
    const queue = [userId];
    const visited = new Set();

    while (queue.length > 0) {
      const current = queue.shift();

      if (visited.has(current)) continue;
      visited.add(current);

      if (current !== userId) {
        reached.add(current);
      }

      const referrals = this.graph.get(current) || new Set();
      for (const referral of referrals) {
        if (!visited.has(referral)) {
          queue.push(referral);
        }
      }
    }

    return reached;
  }

  // Get top k referrers by reach
  getTopReferrersByReach(k = 10) {
    const referralCounts = [];

    for (const userId of this.users) {
      const count = this.getTotalReferralCount(userId);
      if (count > 0) {
        referralCounts.push({ userId, count });
      }
    }

    return referralCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, k)
      .map((item) => ({ userId: item.userId, totalReferrals: item.count }));
  }

  /**
   * Part 3: Influencer Identification
   */

  // Metric 1: Unique Reach Expansion (Greedy Algorithm)
  getUniqueReachInfluencers(k = 10) {
    // Pre-compute downstream reach for all users
    const reachSets = new Map();
    for (const userId of this.users) {
      reachSets.set(userId, this.getDownstreamReach(userId));
    }

    const selected = [];
    const globalReached = new Set();

    for (let i = 0; i < k && selected.length < this.users.size; i++) {
      let bestUser = null;
      let maxNewReach = 0;

      // Find user who adds most new unique reach
      for (const userId of this.users) {
        if (selected.some((s) => s.userId === userId)) continue;

        const userReach = reachSets.get(userId);
        const newReach = Array.from(userReach).filter(
          (u) => !globalReached.has(u)
        ).length;

        if (newReach > maxNewReach) {
          maxNewReach = newReach;
          bestUser = userId;
        }
      }

      if (bestUser && maxNewReach > 0) {
        selected.push({ userId: bestUser, uniqueReach: maxNewReach });
        // Add this user's reach to global set
        const userReach = reachSets.get(bestUser);
        userReach.forEach((u) => globalReached.add(u));
      } else {
        break;
      }
    }

    return selected;
  }

  // Metric 2: Flow Centrality (Betweenness-like)
  getFlowCentralityInfluencers(k = 10) {
    // Pre-compute shortest distances between all pairs
    const distances = this.computeAllPairsShortestPath();
    const centralityScores = new Map();

    // Initialize scores
    for (const user of this.users) {
      centralityScores.set(user, 0);
    }

    // For each pair of users, check which users lie on shortest paths
    for (const source of this.users) {
      for (const target of this.users) {
        if (source === target) continue;

        const distST = distances.get(`${source}-${target}`);
        if (distST === Infinity) continue;

        // Check each potential broker
        for (const broker of this.users) {
          if (broker === source || broker === target) continue;

          const distSV = distances.get(`${source}-${broker}`);
          const distVT = distances.get(`${broker}-${target}`);

          // Broker lies on shortest path if dist(s,v) + dist(v,t) == dist(s,t)
          if (distSV + distVT === distST) {
            centralityScores.set(broker, centralityScores.get(broker) + 1);
          }
        }
      }
    }

    return Array.from(centralityScores.entries())
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([userId, score]) => ({ userId, centralityScore: score }));
  }

  // Compute shortest path distances between all pairs using BFS
  computeAllPairsShortestPath() {
    const distances = new Map();

    for (const source of this.users) {
      // BFS from source
      const dist = new Map();
      const queue = [source];
      dist.set(source, 0);

      while (queue.length > 0) {
        const current = queue.shift();
        const currentDist = dist.get(current);

        const neighbors = this.graph.get(current) || new Set();
        for (const neighbor of neighbors) {
          if (!dist.has(neighbor)) {
            dist.set(neighbor, currentDist + 1);
            queue.push(neighbor);
          }
        }
      }

      // Store distances from source to all other nodes
      for (const target of this.users) {
        const key = `${source}-${target}`;
        distances.set(key, dist.has(target) ? dist.get(target) : Infinity);
      }
    }

    return distances;
  }

  /**
   * Part 4: Network Growth Simulation
   */

  // Simulate network growth over time
  simulate(probability, days) {
    const results = [];
    let activeReferrers = 100; // Initial active referrers
    const maxReferrals = 10; // Max referrals per user
    const referralCounts = new Array(activeReferrers).fill(0); // Track referrals per user

    let cumulativeTotal = 0;

    for (let day = 1; day <= days; day++) {
      let dailyReferrals = 0;

      // Each active referrer attempts to make a referral
      for (let i = 0; i < activeReferrers; i++) {
        if (referralCounts[i] < maxReferrals && Math.random() < probability) {
          referralCounts[i]++;
          dailyReferrals++;

          // If this referrer reaches max capacity, they become inactive
          if (referralCounts[i] >= maxReferrals) {
            // Replace with a new active referrer (newly referred person)
            referralCounts[i] = 0;
          }
        }
      }

      cumulativeTotal += dailyReferrals;
      results.push(cumulativeTotal);
    }

    return results;
  }

  // Find minimum days to reach target
  daysToTarget(probability, targetTotal) {
    let day = 1;
    const maxDays = 10000; // Prevent infinite loops

    while (day <= maxDays) {
      const results = this.simulate(probability, day);
      if (results[day - 1] >= targetTotal) {
        return day;
      }
      day++;
    }

    return null; // Target unreachable
  }

  /**
   * Part 5: Referral Bonus Optimization
   */

  // Find minimum bonus to achieve target hires
  minBonusForTarget(days, targetHires, adoptionProbFunc, eps = 1e-3) {
    let low = 0;
    let high = 10000; // Maximum reasonable bonus
    let result = null;

    // Binary search for minimum bonus
    while (high - low > eps) {
      const midBonus = Math.floor((low + high) / 20) * 10; // Round to nearest $10
      const probability = adoptionProbFunc(midBonus);

      const simulation = this.simulate(probability, days);
      const achievedHires = simulation[days - 1] || 0;

      if (achievedHires >= targetHires) {
        result = midBonus;
        high = midBonus - 10;
      } else {
        low = midBonus + 10;
      }

      // Prevent infinite loop
      if (low > 10000) break;
    }

    return result ? Math.ceil(result / 10) * 10 : null;
  }

  // Get network statistics
  getNetworkStats() {
    const totalUsers = this.users.size;
    const totalReferrals = Array.from(this.graph.values()).reduce(
      (sum, refs) => sum + refs.size,
      0
    );

    const topReferrers = this.getTopReferrersByReach(5);
    const uniqueInfluencers = this.getUniqueReachInfluencers(5);
    const flowInfluencers = this.getFlowCentralityInfluencers(5);

    return {
      totalUsers,
      totalReferrals,
      topReferrers,
      uniqueInfluencers,
      flowInfluencers,
      avgReferralsPerUser: totalUsers > 0 ? totalReferrals / totalUsers : 0,
    };
  }
}

export default ReferralNetwork;
