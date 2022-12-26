export interface CommonProps {
  name: string
}
export function Common(props: CommonProps) {
  return <div>{props.name}</div>
}
