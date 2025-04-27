import MightKnow from "@/components/ui/MightKnow";
import Search from "@/components/ui/search/Search";

export default function SearchPage() {
  return (
    <div className="p-2 flex flex-col gap-3">
      <Search />
      <MightKnow />
    </div>
  );
}
