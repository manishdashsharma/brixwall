import {
  Box,
  Boxes,
  Clock,
  Cloud,
  Cog,
  Cpu,
  Database,
  Gauge,
  Globe,
  HardDrive,
  Layers,
  Leaf,
  ListOrdered,
  Mail,
  Package,
  Puzzle,
  Radio,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Waypoints,
  Workflow,
  Zap,
} from 'lucide-react';
import { hashString } from './hash.js';

const ICON_RULES = [
  [/mongo/, Leaf],
  [/postgres|pgvector|mysql|mariadb|sqlite|cockroach|sql/, Database],
  [/redis|valkey|memcache|cache/, Zap],
  [/gateway|traefik|haproxy|envoy|kong/, Waypoints],
  [/nginx|caddy|httpd|apache|proxy/, Globe],
  [/web|frontend|client|ui|next|vite|nuxt/, Globe],
  [/scheduler|cron/, Clock],
  [/queue|rabbit|kafka|nats|bull|sqs/, ListOrdered],
  [/worker|job|consumer/, Cog],
  [/minio|s3|storage|volume|upload/, HardDrive],
  [/socket|ws|realtime|pusher/, Radio],
  [/mail|smtp|postfix/, Mail],
  [/search|elastic|meili|opensearch|typesense/, Search],
  [/auth|keycloak|oauth|identity/, ShieldCheck],
  [/grafana|prometheus|monitor|metrics|loki/, Gauge],
  [/api|backend|server|express|service/, Server],
];

const FALLBACK_ICONS = [Box, Boxes, Package, Cpu, Layers, Rocket, Cloud, Puzzle, Terminal, Workflow];

const containerIconFor = (container) => {
  const text = `${container.name} ${container.image ?? ''}`.toLowerCase();
  const rule = ICON_RULES.find(([pattern]) => pattern.test(text));
  if (rule) {
    return rule[1];
  }
  return FALLBACK_ICONS[hashString(container.name) % FALLBACK_ICONS.length];
};

export { containerIconFor };
