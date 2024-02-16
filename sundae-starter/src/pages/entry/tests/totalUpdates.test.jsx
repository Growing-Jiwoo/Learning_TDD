import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";
import { logRoles } from "@testing-library/react";

test("update scoop subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update scoop subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  const toppingsSubTotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubTotal).toHaveTextContent("0.00");

  const cherriesToppings = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  expect(cherriesToppings).not.toBeChecked();

  await user.click(cherriesToppings);
  expect(cherriesToppings).toBeChecked();
  expect(toppingsSubTotal).toHaveTextContent("1.50");

  const hotFudgeToppings = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });

  expect(hotFudgeToppings).not.toBeChecked();

  await user.click(hotFudgeToppings);
  expect(hotFudgeToppings).toBeChecked();
  expect(toppingsSubTotal).toHaveTextContent("3.00");

  const mnMsToppings = await screen.findByRole("checkbox", {
    name: "M&Ms",
  });

  expect(mnMsToppings).not.toBeChecked();
  await user.click(mnMsToppings);
  expect(mnMsToppings).toBeChecked();
  expect(toppingsSubTotal).toHaveTextContent("4.50");

  await user.click(hotFudgeToppings);
  expect(hotFudgeToppings).not.toBeChecked();
  expect(toppingsSubTotal).toHaveTextContent("3.00");
});

describe("grand total", () => {
  test("grand total starts at $0.00", () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /Grand total: \$/,
    });

    expect(grandTotal).toHaveTextContent("0.00");
  });

  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();

    render(<OrderEntry />);

    const grandTotal = await screen.findByRole("heading", {
      name: /Grand total: \$/,
    });

    expect(grandTotal).toHaveTextContent("0.00");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");

    expect(grandTotal).toHaveTextContent("2.00");

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "0");

    expect(grandTotal).toHaveTextContent("0.00");
  });
  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();

    render(<OrderEntry />);

    const grandTotal = await screen.findByRole("heading", {
      name: /Grand total: \$/,
    });

    expect(grandTotal).toHaveTextContent("0.00");

    const cherriesToppings = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    expect(cherriesToppings).not.toBeChecked();
    expect(grandTotal).toHaveTextContent("0.00");

    await user.click(cherriesToppings);

    expect(cherriesToppings).toBeChecked();
    expect(grandTotal).toHaveTextContent("1.50");

    await user.click(cherriesToppings);

    expect(cherriesToppings).not.toBeChecked();
    expect(grandTotal).toHaveTextContent("0.00");
  });

  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();

    render(<OrderEntry />);

    const grandTotal = await screen.findByRole("heading", {
      name: /Grand total: \$/,
    });

    expect(grandTotal).toHaveTextContent("0.00");

    // 토핑 선택하고 총액 확인
    const cherriesToppings = await screen.findByRole("checkbox", {
      name: /cherries/i,
    });

    expect(cherriesToppings).not.toBeChecked();

    await user.click(cherriesToppings);

    expect(cherriesToppings).toBeChecked();
    expect(grandTotal).toHaveTextContent("1.50");

    // 스쿱 선택하고 총액 확인
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: /vanilla/i,
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");

    expect(grandTotal).toHaveTextContent("3.50");

    // 토핑 or 스쿱 빼고 총액 확인
    await user.type(vanillaInput, "0");
    expect(grandTotal).toHaveTextContent("1.50");

    await user.click(cherriesToppings);
    expect(cherriesToppings).not.toBeChecked();

    expect(grandTotal).toHaveTextContent("0.00");
  });
});
