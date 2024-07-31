import AutoCompletePlayer from "@/components/ui/custom/autocomplete-player";

export default function CreateGameRoute() {

  return (
    <div className="max-w-4xl mx-auto my-4 px-4">
      <form>
        <div className="flex space-x-4">
          <AutoCompletePlayer color="white" />
          <AutoCompletePlayer />
        </div>
      </form>
    </div>
  )
}

