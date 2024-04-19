import InputTextComponent from "components/input/input.text.component";

export default function AddGame() {
    return <div className=" max-w-2xl border-x m-auto border-neutral-700">
        <div className="p-2">
            <form className="mt-2wg">
                <div className="flex items-center align-middle">
                    <InputTextComponent className="flex-1" label="white player" />
                    <p className=" mx-2 font-bold italic">VS</p>
                    <InputTextComponent className="flex-1" label="black player" />
                </div>
            </form>
        </div>
    </div>
}
