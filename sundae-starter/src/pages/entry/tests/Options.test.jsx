import { render, screen } from "../../../test-utils/testing-library-utils";
import { userEvent } from "@testing-library/user-event";
import Options from "../Options";

test("displays image for each scoop option from server", async () => {
  render(<Options optionType="scoops" />);

  // find images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  // confirm alt text of images
  // @ts-ignore
  const altText = scoopImages.map((element) => element.alt);
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("Displays image for each toppings option from server", async () => {
  // Mock Service Worker will return three toppings from server
  render(<Options optionType="toppings" />);

  // find images, expect 3 based on what msw returns
  const images = await screen.findAllByRole("img", { name: /topping$/i });
  expect(images).toHaveLength(3);

  // check the actual alt text for the images
  // @ts-ignore
  const imageTitles = images.map((img) => img.alt);
  expect(imageTitles).toEqual([
    "Cherries topping",
    "M&Ms topping",
    "Hot fudge topping",
  ]);
});

// 유효하지 않은 스쿱 개수가 있으면 합계액을 업데이트 하지 않도록
// -> 스쿱 갯수 값 유효성 검사 이후, 최소한의 렌더링, userEvent keyboard 메소드 사용

test("유효하지 않은 스쿱 개수가 있으면 합계액을 업데이트 하지 않음", async () => {
  const user = userEvent.setup();

  render(<Options optionType="scoops" />);

  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "1.5");

  screen.getByText("Scoops total: $0.00");

  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "-5");

  screen.getByText("Scoops total: $0.00");

  await user.clear(chocolateScoop);
  await user.type(chocolateScoop, "1");

  screen.getByText("Scoops total: $2.00");
});
