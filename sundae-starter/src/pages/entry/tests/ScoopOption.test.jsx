import { render, screen } from "../../../test-utils/testing-library-utils";
import { userEvent } from "@testing-library/user-event";
import ScoopOption from "../ScoopOption";

// 스쿱 갯수 값의 유효성 검사, 사람들이 음수나 소수를 입력하지 못하게끔
// -> jest의 toHaveClass 사용

test("스쿱 갯수 값을 음수나 소수를 입력하지 못하게끔 유효셩 검사", async () => {
  const user = userEvent.setup();
  render(<ScoopOption />);

  const vanillaInput = screen.getByRole("spinbutton");

  // 올바르지 않은 수 입력
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "-1");
  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2.5");
  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "20");
  expect(vanillaInput).toHaveClass("is-invalid");

  // 올바른 수 입력
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "0");
  expect(vanillaInput).not.toHaveClass("is-invalid");
});
