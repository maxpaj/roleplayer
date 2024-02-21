type NewCharacterProps = {};

export function CreateCharacterForm({}: NewCharacterProps) {
  function createNewCharacter():
    | import("react").MouseEventHandler<HTMLButtonElement>
    | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <h1>New character form</h1>
      <form>
        <input type="name" placeholder="name" />
        <button onClick={createNewCharacter()}>Create new character</button>
      </form>
    </>
  );
}
