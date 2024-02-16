import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();

  // render app
  // 앱 렌더링
  render(<App />);

  // add ice cream coops and toppings ()
  // 스쿱과 토핑 추가
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const cherriesToppings = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  await user.click(cherriesToppings);

  expect(cherriesToppings).toBeChecked();

  // find and click order button
  // 주문 입력 페이지에서 주문 버튼을 찾아 클릭
  const orderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });

  await user.click(orderSummaryButton);

  // check summary information based on order
  // 주문 내용을 기반으로 요약 정보가 올바른지 확인
  const checkSummary = screen.getByRole("heading", { name: /order summary/i });
  expect(checkSummary).toBeInTheDocument();

  const checkToppingsOrder = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(checkToppingsOrder).toBeInTheDocument();

  const checkScoopsOrder = screen.getByRole("heading", {
    name: "Scoops: $2.00",
  });
  expect(checkScoopsOrder).toBeInTheDocument();

  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  // 이용 약관을 수락하고 버튼을 클릭해 주문을 확인
  const termsCheckbox = screen.getByRole("checkbox", {
    name: /I agree to Terms and Conditions/i,
  });
  await user.click(termsCheckbox);

  const confirmOrderBtn = screen.getByRole("button", {
    name: /Confirm order/i,
  });
  await user.click(confirmOrderBtn);

  // confirm order number on confirmation page
  // 확인 페이지에서 주문 번호가 존재하는지 확인
  const thankYouHeader = await screen.findByText(/thank you/i);
  expect(thankYouHeader).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page ()
  // 확인 페이지에서 새 주문 버튼 클릭
  const newOrderBtn = screen.getByRole("button", { name: /Create new order/i });
  await user.click(newOrderBtn);

  // check thap scoop and toppings subtotals have been reset
  // 스쿱과 토핑 소계 재설정 됐는지 확인
  const resetToppingsOrder = screen.getByText("Toppings total: $0.00");
  expect(resetToppingsOrder).toBeInTheDocument();

  const resetScoopsOrder = screen.getByText("Scoops total: $0.00");
  expect(resetScoopsOrder).toBeInTheDocument();
});
