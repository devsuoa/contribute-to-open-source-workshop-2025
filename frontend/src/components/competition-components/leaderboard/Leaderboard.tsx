import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faMedal,
  faAward,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

interface LeaderboardRow {
  rank: number;
  nick: string;
  points: number;
}

const Leaderboard = () => {
  const { competitionId } = useParams();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<{ results: LeaderboardRow[] }>(
          `${import.meta.env.VITE_API_BASE_URL}/api/competitions/${competitionId}/leaderboard`,
        );
        setRows(res.data.results);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Could not load leaderboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, [competitionId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <FontAwesomeIcon
            icon={faTrophy}
            className="h-6 w-6 text-yellow-500"
          />
        );
      case 2:
        return (
          <FontAwesomeIcon icon={faMedal} className="h-6 w-6 text-gray-400" />
        );
      case 3:
        return (
          <FontAwesomeIcon icon={faAward} className="h-6 w-6 text-amber-600" />
        );
      default:
        return null;
    }
  };

  const getRankBadgeVariant = (
    rank: number,
  ): "default" | "secondary" | "outline" => {
    if (rank <= 3) return "default";
    if (rank <= 10) return "secondary";
    return "outline";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#C5C5C5]">
        <FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" />
        <span>Loading leaderboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="h-12 w-12 text-red-500 mx-auto mb-4"
          />
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {rows.length === 0 ? (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faTrophy}
            className="h-16 w-16 text-muted-foreground mx-auto mb-4"
          />
          <p className="text-lg text-muted-foreground">No competitors yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Be the first to join the competition!
          </p>
        </div>
      ) : (
        <div className="border border-[#2F2F2F] rounded-md bg-[#171717]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#2F2F2F]">
                <TableHead className="w-24 text-lg font-semibold py-3 px-4">
                  Rank
                </TableHead>
                <TableHead className="text-lg font-semibold py-3 px-4">
                  Player
                </TableHead>
                <TableHead className="text-right text-lg font-semibold py-3 px-4">
                  Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.rank}
                  className="border-b border-[#2F2F2F] last:border-b-0"
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {getRankIcon(row.rank)}
                      </div>
                      <Badge variant={getRankBadgeVariant(row.rank)}>
                        #{row.rank}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-lg py-3 px-4">
                    {row.nick}
                  </TableCell>
                  <TableCell className="text-right py-3 px-4">
                    <span className="font-mono text-lg font-semibold">
                      {row.points.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      pts
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
